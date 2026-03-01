import { useState } from "react";
import { useTeams, useCreateTeam } from "@/hooks/use-teams";
import { useGames } from "@/hooks/use-games";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function TeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const { data: games } = useGames();
  const createTeam = useCreateTeam();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", gameId: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeam.mutate({
      name: formData.name,
      gameId: parseInt(formData.gameId)
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({ name: "", gameId: "" });
      }
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin w-10 h-10 border-4 border-secondary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-glow-cyan text-secondary">Squads</h1>
          <p className="text-muted-foreground mt-1">Browse top tier teams or forge your own legacy.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-black hover:bg-secondary/80 font-display uppercase tracking-widest shadow-[0_0_15px_hsl(var(--secondary)/0.4)] gap-2 h-12 px-6">
              <Plus className="w-5 h-5" /> Form Squad
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-secondary/30 shadow-[0_0_40px_hsl(var(--secondary)/0.2)]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl uppercase tracking-widest text-secondary">Initialize Squad</DialogTitle>
              <DialogDescription>Define your team parameters to enter the competitive grid.</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Designation (Team Name)</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  placeholder="e.g. Cyber Ninjas"
                  className="bg-background border-white/10 h-12 focus-visible:ring-secondary focus-visible:border-secondary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Primary Combat Protocol (Game)</label>
                <Select value={formData.gameId} onValueChange={(v) => setFormData(p => ({...p, gameId: v}))} required>
                  <SelectTrigger className="w-full bg-background border-white/10 h-12 focus:ring-secondary">
                    <SelectValue placeholder="Select protocol..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-white/10">
                    {games?.map((g: any) => (
                      <SelectItem key={g.id} value={g.id.toString()}>{g.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Abort</Button>
                <Button type="submit" disabled={createTeam.isPending} className="bg-secondary text-black hover:bg-secondary/80">
                  {createTeam.isPending ? "Processing..." : "Execute"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {teams?.map((team: any) => (
          <CyberCard key={team.id} interactive glowColor="secondary" className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded bg-gradient-to-br from-black to-secondary/20 border border-secondary/30 flex items-center justify-center shadow-[0_0_15px_hsl(var(--secondary)/0.2)]">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <NeonBadge color="secondary">{team.game?.name || "Multi"}</NeonBadge>
            </div>
            
            <h3 className="text-2xl font-bold font-display uppercase tracking-widest mb-1 truncate">{team.name}</h3>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {team.memberCount || 1} Mbrs
              </div>
              <div className="flex items-center gap-1">
                ELO <span className="font-bold text-white">{team.elo || 1000}</span>
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
}
