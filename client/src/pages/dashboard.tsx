import { useAuth } from "@/hooks/use-auth";
import { useTournaments } from "@/hooks/use-tournaments";
import { useMyTeams } from "@/hooks/use-teams";
import { useMyProfiles } from "@/hooks/use-profiles";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Trophy, Crosshair, Target, Zap, Clock, Shield, Star, Rocket } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

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
  const { data: profile } = useMyProfiles();

  const upcomingTournaments = tournaments?.filter((t: any) => t.status === "upcoming" || t.status === "registration_opened").slice(0, 3) || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Profile Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border border-white/5 p-8 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
             <div className="w-24 h-24 rounded-full border-2 border-primary p-1 box-glow">
                <img 
                  src={user?.profileImageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.id} 
                  className="w-full h-full rounded-full bg-muted"
                  alt="avatar" 
                />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
               LVL {profile?.level || 1}
             </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-muted-foreground font-display tracking-[0.3em] text-[10px] uppercase mb-1">Authenticated Operative</h2>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-glow uppercase tracking-tight mb-2">
              {profile?.inGameName || user?.firstName || 'Unknown'}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               <NeonBadge color="primary">{profile?.subscriptionTier?.toUpperCase() || "FREE"} AGENT</NeonBadge>
               <NeonBadge color="accent">{profile?.rank || "UNRANKED"}</NeonBadge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 relative z-10 items-center">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-display uppercase tracking-[0.2em] mb-1">Deployment XP</p>
            <div className="w-32 space-y-1">
               <div className="flex justify-between text-[8px] uppercase tracking-widest text-primary">
                 <span>{profile?.matchesPlayed || 0} Matches</span>
                 <span>Next Level</span>
               </div>
               <Progress value={45} className="h-1 bg-white/5" />
            </div>
          </div>
          <div className="w-px bg-white/10 h-10 hidden sm:block" />
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-display uppercase tracking-[0.2em] mb-1">Global Standing</p>
            <p className="text-3xl font-bold text-secondary text-glow-cyan font-display tracking-tighter">#4,209</p>
          </div>
          <div className="w-px bg-white/10 h-10 hidden sm:block" />
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-display uppercase tracking-[0.2em] mb-1">War Chest</p>
            <p className="text-3xl font-bold text-primary text-glow font-display tracking-tighter">${profile?.winnings || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CyberCard glowColor="primary">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded text-primary border border-primary/20">
                  <Target className="w-5 h-5" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Efficiency</p>
                   <p className="font-bold text-primary">2.4 KD</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display tracking-widest text-glow">{profile?.elo || 1000}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Combat Rating (ELO)</p>
            </CyberCard>
            
            <CyberCard glowColor="secondary">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary/10 rounded text-secondary border border-secondary/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Victories</p>
                   <p className="font-bold text-secondary">08</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display tracking-widest text-glow-cyan">{profile?.matchesPlayed || 0}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Deployments</p>
            </CyberCard>

            <CyberCard glowColor="accent">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-accent/10 rounded text-accent border border-accent/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active</p>
                   <p className="font-bold text-accent">PRO</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display tracking-widest uppercase text-glow-purple">{profile?.subscriptionTier || 'Free'}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Contract Status</p>
            </CyberCard>
          </div>

          {/* Performance Graph */}
          <CyberCard className="h-[350px] flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-display uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                 <Rocket className="w-4 h-4 text-primary" /> Tactical Progression
               </h3>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[8px] uppercase text-muted-foreground">ELO Rating</span>
                  </div>
               </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEloData}>
                  <defs>
                    <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'hsl(var(--primary)/0.3)', color: '#fff', borderRadius: '0px', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="elo" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorElo)" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CyberCard>
        </div>

        {/* Right Column - Mission Intel */}
        <div className="space-y-6">
          <CyberCard glowColor="accent" className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <h3 className="font-display uppercase tracking-widest text-xs flex items-center gap-2">
                 <Clock className="w-3 h-3 text-accent" /> Active Missions
               </h3>
               <span className="text-[8px] text-accent animate-pulse">LIVE_SYNC</span>
            </div>
            <div className="p-4 space-y-4">
               {tourneyLoading ? (
                 <p className="text-[10px] uppercase text-muted-foreground animate-pulse text-center py-4">Scanning Sector...</p>
               ) : upcomingTournaments.length > 0 ? (
                 upcomingTournaments.map((t: any) => (
                   <div key={t.id} className="group flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded transition-all hover:border-accent/50 cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-accent font-display uppercase tracking-tighter mb-1">{t.type}</span>
                        <h4 className="font-bold text-xs truncate max-w-[120px] uppercase tracking-wide">{t.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-white">${t.jackpot}</p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{format(new Date(t.startDate), "HH:mm")}</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <p className="text-[10px] text-muted-foreground text-center py-4">No active deployments.</p>
               )}
            </div>
          </CyberCard>

          <CyberCard glowColor="secondary" className="p-0 overflow-hidden">
             <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <h3 className="font-display uppercase tracking-widest text-xs flex items-center gap-2">
                 <Shield className="w-3 h-3 text-secondary" /> Active Squads
               </h3>
               <span className="text-[8px] text-muted-foreground uppercase">{teams?.length || 0} Registered</span>
            </div>
            <div className="p-4 space-y-3">
               {teamsLoading ? (
                 <p className="text-[10px] uppercase text-muted-foreground animate-pulse text-center py-4">Fetching Squad Data...</p>
               ) : teams && teams.length > 0 ? (
                 teams.map((t: any) => (
                   <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded transition-all cursor-pointer border border-transparent hover:border-white/10 group">
                      <div className="w-10 h-10 rounded border border-secondary/30 bg-secondary/10 flex items-center justify-center text-secondary font-display font-bold text-sm group-hover:shadow-[0_0_10px_hsl(var(--secondary)/0.5)] transition-all">
                        {t.name.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-xs truncate uppercase tracking-wide">{t.name}</h4>
                         <div className="flex items-center gap-2">
                           <span className="text-[8px] text-muted-foreground uppercase">{t.type}</span>
                           <span className="w-1 h-1 rounded-full bg-white/10"></span>
                           <span className="text-[8px] text-secondary font-bold uppercase">{t.elo} ELO</span>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-6 text-center space-y-2">
                   <p className="text-[10px] text-muted-foreground italic uppercase">No squad detected</p>
                 </div>
               )}
            </div>
          </CyberCard>
          
          <CyberCard glowColor="primary" className="p-4 bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
             <h3 className="font-display uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
               <Star className="w-3 h-3 text-primary" /> Elite Rewards
             </h3>
             <p className="text-[10px] text-muted-foreground mb-4 uppercase leading-relaxed">Upgrade to Elite tier for instant mission access and 2x jackpot rewards.</p>
             <Button className="w-full h-8 bg-primary text-black font-display uppercase tracking-widest text-[10px] hover:bg-primary/80 transition-all border-none">Upgrade Now</Button>
          </CyberCard>
        </div>
      </div>
    </div>
  );
}
