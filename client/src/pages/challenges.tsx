import { useState } from "react";
import { useMyChallenges, useCreateChallenge } from "@/hooks/use-challenges";
import { useGames } from "@/hooks/use-games";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function ChallengesPage() {
  const { data: challenges, isLoading } = useMyChallenges();
  const { data: games } = useGames();
  const createChallenge = useCreateChallenge();
  
  const [formData, setFormData] = useState({ challengedId: "", gameId: "", wager: "0" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChallenge.mutate({
      challengedId: formData.challengedId,
      gameId: parseInt(formData.gameId),
      wager: parseInt(formData.wager) || 0
    }, {
      onSuccess: () => {
        setFormData({ challengedId: "", gameId: "", wager: "0" });
      }
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-glow-cyan text-accent">Wager & Challenge</h1>
          <p className="text-muted-foreground mt-1">Send direct combat requests to other operatives.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left Column - Form */}
        <div className="lg:col-span-1">
          <CyberCard glowColor="accent" className="sticky top-24">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Target className="w-6 h-6 text-accent" />
              <h2 className="font-display text-xl uppercase tracking-widest">Issue Challenge</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Target ID (User UUID)</label>
                <Input 
                  value={formData.challengedId}
                  onChange={(e) => setFormData(p => ({...p, challengedId: e.target.value}))}
                  placeholder="Enter User ID..."
                  className="bg-background border-white/10 h-12 focus-visible:ring-accent focus-visible:border-accent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Protocol (Game)</label>
                <Select value={formData.gameId} onValueChange={(v) => setFormData(p => ({...p, gameId: v}))} required>
                  <SelectTrigger className="w-full bg-background border-white/10 h-12 focus:ring-accent">
                    <SelectValue placeholder="Select protocol..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-white/10">
                    {games?.map((g: any) => (
                      <SelectItem key={g.id} value={g.id.toString()}>{g.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Wager (RC)</label>
                <Input 
                  type="number"
                  min="0"
                  value={formData.wager}
                  onChange={(e) => setFormData(p => ({...p, wager: e.target.value}))}
                  className="bg-background border-white/10 h-12 focus-visible:ring-accent focus-visible:border-accent font-mono text-lg"
                />
              </div>

              <Button type="submit" disabled={createChallenge.isPending} className="w-full h-14 mt-4 bg-accent text-white hover:bg-accent/80 font-display text-lg uppercase tracking-widest shadow-[0_0_20px_hsl(var(--accent)/0.4)]">
                {createChallenge.isPending ? "Transmitting..." : "Send Request"}
              </Button>
            </form>
          </CyberCard>
        </div>

        {/* Right Column - List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl uppercase tracking-widest text-muted-foreground mb-4">Active & Pending Signals</h2>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-card/50 rounded border border-white/5" />)}
            </div>
          ) : challenges && challenges.length > 0 ? (
            challenges.map((c: any) => (
              <CyberCard key={c.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded flex items-center justify-center border ${
                    c.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                    c.status === 'accepted' ? 'bg-primary/10 border-primary/30 text-primary' :
                    'bg-white/5 border-white/10 text-muted-foreground'
                  }`}>
                    <Swords className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold uppercase tracking-wider">
                      Match vs {c.challengedId.substring(0,8)}...
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {c.game?.name} • Issued: {format(new Date(c.createdAt), "MMM dd")}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <NeonBadge color={
                    c.status === 'pending' ? 'accent' :
                    c.status === 'accepted' ? 'primary' : 'muted'
                  }>
                    {c.status}
                  </NeonBadge>
                  {c.wager > 0 && <span className="font-mono font-bold text-sm text-yellow-500">{c.wager} RC</span>}
                </div>
              </CyberCard>
            ))
          ) : (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-lg bg-black/20">
              <Swords className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-muted-foreground font-display tracking-widest uppercase">No active challenges detected in network.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
