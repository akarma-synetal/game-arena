import { useState } from "react";
import { useTournaments, useRegisterTournament } from "@/hooks/use-tournaments";
import { useMyTeams } from "@/hooks/use-teams";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function TournamentsPage() {
  const { data: tournaments, isLoading } = useTournaments();
  const { data: teams } = useMyTeams();
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  
  const registerMutation = useRegisterTournament(selectedTournament?.id || 0);

  const handleRegister = () => {
    if (!selectedTeamId) return;
    registerMutation.mutate(
      { teamId: parseInt(selectedTeamId) },
      { onSuccess: () => setSelectedTournament(null) }
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'secondary';
      case 'registration_opened': return 'primary';
      case 'published': return 'accent';
      default: return 'muted';
    }
  };

  const getGameImage = (gameName: string) => {
    switch(gameName?.toLowerCase()) {
      case 'bgmi': return '/images/bgmi.png';
      case 'valorant': return '/images/valorant.png';
      case 'freefire': return '/images/freefire.webp';
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-glow">Tournaments</h1>
          <p className="text-muted-foreground mt-1">Discover and join active competitive events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {tournaments?.map((t: any, i: number) => {
          const gameImg = getGameImage(t.game?.name);
          const color = getStatusColor(t.status);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              key={t.id}
            >
              <CyberCard interactive glowColor={color as any} className="h-full flex flex-col p-0 overflow-hidden">
                {/* Header Image area */}
                <div className="h-32 bg-black/50 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  {gameImg ? (
                    <>
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]" style={{ backgroundImage: `url(${gameImg})` }} />
                      <img src={gameImg} alt={t.game?.displayName} className="h-24 object-contain relative z-10 drop-shadow-2xl" />
                    </>
                  ) : (
                    <Trophy className="w-12 h-12 text-muted-foreground/30" />
                  )}
                  <div className="absolute top-3 right-3">
                     <NeonBadge color={color as any}>{t.status.replace('_', ' ')}</NeonBadge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold font-display uppercase tracking-wider mb-2">{t.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {format(new Date(t.startDate), "MMM dd, yyyy - HH:mm")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary" />
                      {t.registeredTeamsCount || 0} / {t.maxTeams} Teams
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      Jackpot: <span className="text-accent font-bold">{t.jackpot} RC</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      className="w-full font-display uppercase tracking-widest"
                      variant={t.status === 'registration_opened' ? 'default' : 'outline'}
                      disabled={t.status !== 'registration_opened'}
                      onClick={() => setSelectedTournament(t)}
                    >
                      {t.status === 'registration_opened' ? 'Register Now' : 'Details'}
                    </Button>
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={!!selectedTournament} onOpenChange={(open) => !open && setSelectedTournament(null)}>
        <DialogContent className="bg-card border border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.2)]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase tracking-widest text-primary">Deploy Squad</DialogTitle>
            <DialogDescription>
              Register a team for <strong className="text-white">{selectedTournament?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="bg-black/50 p-4 rounded border border-white/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">Once registered, your team roster is locked for this tournament. Ensure your operatives are ready.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Select Squad</label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-full bg-background border-white/10 h-12">
                  <SelectValue placeholder="Choose an eligible team..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/10">
                  {teams?.map((team: any) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name} (ELO: {team.elo || 1000})
                    </SelectItem>
                  ))}
                  {(!teams || teams.length === 0) && (
                    <div className="p-2 text-sm text-muted-foreground text-center">No teams available. Create one first.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setSelectedTournament(null)}>Abort</Button>
            <Button 
              onClick={handleRegister} 
              disabled={!selectedTeamId || registerMutation.isPending}
              className="bg-primary text-white hover:bg-primary/80 font-display uppercase tracking-widest shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
            >
              {registerMutation.isPending ? "Transmitting..." : "Confirm Registration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
