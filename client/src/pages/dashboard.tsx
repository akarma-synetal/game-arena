import { useAuth } from "@/hooks/use-auth";
import { useTournaments } from "@/hooks/use-tournaments";
import { useMyTeams } from "@/hooks/use-teams";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Trophy, Crosshair, Target, Zap, Clock } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockEloData = [
  { name: 'W1', elo: 1000 },
  { name: 'W2', elo: 1050 },
  { name: 'W3', elo: 1020 },
  { name: 'W4', elo: 1100 },
  { name: 'W5', elo: 1180 },
  { name: 'W6', elo: 1250 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tournaments, isLoading: tourneyLoading } = useTournaments();
  const { data: teams, isLoading: teamsLoading } = useMyTeams();

  const upcomingTournaments = tournaments?.filter((t: any) => t.status === "upcoming").slice(0, 2) || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-card to-transparent p-6 rounded-lg border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop')] bg-cover opacity-10 [mask-image:linear-gradient(to_left,black,transparent)]" />
        
        <div className="relative z-10">
          <h2 className="text-muted-foreground font-display tracking-widest text-sm uppercase mb-1">Welcome Back, Operative</h2>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-glow uppercase tracking-tight">
            {user?.firstName || 'Player'} {user?.lastName || ''}
          </h1>
        </div>
        
        <div className="flex gap-4 relative z-10">
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-display uppercase tracking-widest">Global Rank</p>
            <p className="text-2xl font-bold text-secondary text-glow-cyan">#402</p>
          </div>
          <div className="w-px bg-white/10 h-10 self-center" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-display uppercase tracking-widest">Total Winnings</p>
            <p className="text-2xl font-bold text-primary text-glow">$1,450</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CyberCard glowColor="primary">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <NeonBadge color="primary">K/D 2.4</NeonBadge>
              </div>
              <h3 className="text-3xl font-bold font-display tracking-widest">1,250</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Current ELO</p>
            </CyberCard>
            
            <CyberCard glowColor="secondary">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary/10 rounded text-secondary">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display tracking-widest">14</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Tournaments Won</p>
            </CyberCard>

            <CyberCard glowColor="accent">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-accent/10 rounded text-accent">
                  <Crosshair className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display tracking-widest">87%</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Win Rate</p>
            </CyberCard>
          </div>

          {/* Chart */}
          <CyberCard className="h-[300px] flex flex-col">
            <h3 className="font-display uppercase tracking-widest text-lg mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Performance History
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEloData}>
                  <defs>
                    <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '4px' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area type="monotone" dataKey="elo" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorElo)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CyberCard>
        </div>

        {/* Right Column - Upcoming & Teams */}
        <div className="space-y-6">
          {/* Upcoming Tournaments Mini */}
          <CyberCard glowColor="accent">
            <h3 className="font-display uppercase tracking-widest text-lg border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Next Deployments
            </h3>
            {tourneyLoading ? (
              <p className="text-sm text-muted-foreground animate-pulse">Scanning network...</p>
            ) : upcomingTournaments.length > 0 ? (
              <div className="space-y-4">
                {upcomingTournaments.map((t: any) => (
                  <div key={t.id} className="flex flex-col p-3 bg-black/40 border border-white/5 rounded hover:border-accent/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold truncate text-sm">{t.name}</h4>
                      <NeonBadge color="accent" className="text-[10px] py-0">{t.jackpot} RC</NeonBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">Starts: {format(new Date(t.startDate), "MMM dd, HH:mm")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming deployments found.</p>
            )}
          </CyberCard>

          {/* Active Teams */}
          <CyberCard glowColor="secondary">
            <h3 className="font-display uppercase tracking-widest text-lg border-b border-white/5 pb-3 mb-4">My Squads</h3>
            {teamsLoading ? (
              <p className="text-sm text-muted-foreground animate-pulse">Loading squads...</p>
            ) : teams && teams.length > 0 ? (
              <div className="space-y-3">
                {teams.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded bg-secondary/20 border border-secondary/50 flex items-center justify-center text-xs font-bold text-secondary">
                      {t.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase">{t.game?.name || "Multiple Games"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You are a lone wolf. Join or create a squad.</p>
            )}
          </CyberCard>
        </div>
      </div>
    </div>
  );
}
