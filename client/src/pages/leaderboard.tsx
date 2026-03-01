import { useLeaderboard } from "@/hooks/use-profiles";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Trophy, Medal, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeaderboardPage() {
  const { data: profiles, isLoading } = useLeaderboard();

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.6)]" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.6)]" />;
      default: return <span className="font-display font-bold text-lg text-muted-foreground">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-glow">Global Rankings</h1>
          <p className="text-muted-foreground mt-1">Top operatives sorted by combat rating (ELO).</p>
        </div>
      </div>

      <CyberCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-white/10">
                <th className="p-4 font-display uppercase tracking-widest text-muted-foreground w-16 text-center">Rank</th>
                <th className="p-4 font-display uppercase tracking-widest text-muted-foreground">Operative</th>
                <th className="p-4 font-display uppercase tracking-widest text-muted-foreground">Game</th>
                <th className="p-4 font-display uppercase tracking-widest text-muted-foreground text-right">Winnings</th>
                <th className="p-4 font-display uppercase tracking-widest text-primary text-right">Rating (ELO)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground animate-pulse">Computing standings...</td></tr>
              ) : profiles?.map((p: any, i: number) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-center">
                    <div className="flex justify-center">{getRankIcon(i)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10 group-hover:border-primary/50 transition-colors">
                        <AvatarFallback className="bg-black text-xs font-bold">{p.inGameName.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-lg font-display tracking-wider">{p.inGameName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <NeonBadge color="muted">{p.game?.name || "Global"}</NeonBadge>
                  </td>
                  <td className="p-4 text-right font-mono text-muted-foreground">
                    {p.winnings ? `${p.winnings} RC` : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-xl font-display text-primary text-glow">{p.elo || 1000}</span>
                  </td>
                </tr>
              ))}
              {(!profiles || profiles.length === 0) && !isLoading && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Database empty. No ranked players found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
}
