import { useMemo } from "react";
import { useTournaments } from "@/hooks/use-tournaments";
import { useLeaderboard } from "@/hooks/use-profiles";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Trophy, Star, Users, Crown, CreditCard } from "lucide-react";

export default function PartnerDashboard() {
  const { data: tournaments } = useTournaments();
  const { data: leaderboard } = useLeaderboard();

  const activeTournaments = useMemo(
    () => (tournaments || []).filter((entry: any) => entry.status !== "finished").length,
    [tournaments],
  );

  const topPlayers = (leaderboard || []).slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-glow">Partner Dashboard</h1>
        <NeonBadge color="accent">Hosting Partner</NeonBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <CyberCard><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tournaments</p><p className="text-3xl font-display text-primary mt-2">{activeTournaments}</p></CyberCard>
        <CyberCard><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Followers</p><p className="text-3xl font-display text-primary mt-2">12.4K</p></CyberCard>
        <CyberCard><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ratings</p><p className="text-3xl font-display text-primary mt-2">4.8/5</p></CyberCard>
        <CyberCard><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Reviews</p><p className="text-3xl font-display text-primary mt-2">1,286</p></CyberCard>
        <CyberCard><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Subscription</p><p className="text-3xl font-display text-primary mt-2">Active</p></CyberCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CyberCard className="space-y-4">
          <h2 className="text-lg font-display uppercase tracking-[0.2em] flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Tournament Pipeline</h2>
          <div className="space-y-3">
            {(tournaments || []).slice(0, 8).map((entry: any) => (
              <div key={entry.id} className="p-3 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide">{entry.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{entry.status}</p>
                </div>
                <NeonBadge color="primary">₹{entry.jackpot}</NeonBadge>
              </div>
            ))}
          </div>
        </CyberCard>

        <CyberCard className="space-y-4">
          <h2 className="text-lg font-display uppercase tracking-[0.2em] flex items-center gap-2"><Crown className="w-4 h-4 text-primary" /> Leaderboard Pulse</h2>
          <div className="space-y-3">
            {topPlayers.map((entry: any, index: number) => (
              <div key={entry.id} className="p-3 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full border border-primary/40 flex items-center justify-center text-xs">{index + 1}</span>
                  <span className="uppercase tracking-wide">{entry.inGameName}</span>
                </div>
                <span className="text-primary font-display text-lg">{entry.elo}</span>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CyberCard>
          <h3 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Subscription Plan</h3>
          <p className="text-2xl font-display text-primary mb-2">Partner Pro</p>
          <p className="text-sm text-muted-foreground">Active until 31 Dec 2026</p>
        </CyberCard>
        <CyberCard>
          <h3 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Followers Growth</h3>
          <p className="text-2xl font-display text-primary mb-2">+18.2%</p>
          <p className="text-sm text-muted-foreground">Monthly engagement growth</p>
        </CyberCard>
        <CyberCard>
          <h3 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Rating Health</h3>
          <p className="text-2xl font-display text-primary mb-2">Excellent</p>
          <p className="text-sm text-muted-foreground">4.8 average over recent 300 reviews</p>
        </CyberCard>
      </div>
    </div>
  );
}
