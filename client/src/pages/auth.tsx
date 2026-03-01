import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Swords, Trophy, Gamepad2, Users, Target, ShieldCheck, Zap, Gift, Crown, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { CyberCard, NeonBadge } from "@/components/ui-extras";

export default function AuthPage() {
  const { data: settings } = useQuery({ queryKey: [api.settings.get.path] });
  const { data: tournaments } = useQuery({ queryKey: [api.tournaments.list.path] });
  
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.2em] text-glow uppercase">{settings?.appName || "BATTLEROOF"}</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 uppercase text-[10px] tracking-[0.3em] font-display text-muted-foreground">
          <a href="#tournaments" className="hover:text-primary transition-colors">Tournaments</a>
          <a href="#features" className="hover:text-primary transition-colors">Scrims</a>
          <a href="#giveaways" className="hover:text-primary transition-colors">Giveaways</a>
          <Button onClick={handleLogin} variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-black font-display tracking-widest text-xs h-10 px-6">Login</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-[0.3em] font-display mb-8">
            <Zap className="w-3 h-3" /> The Next Gen Esports Platform
          </div>
          <h1 className="text-6xl lg:text-9xl font-display font-bold uppercase leading-tight tracking-tighter mb-8 italic">
            Dominate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary text-glow">The Grid</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-12">
            Register for professional BGMI, FreeFire, and Valorant tournaments. Host scrims, win jackpots, and climb the global ranks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleLogin}
              className="h-16 px-12 text-lg font-display uppercase tracking-widest font-bold bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] border-none"
            >
              Start Your Career
            </Button>
            <Button variant="ghost" className="h-16 px-12 text-sm uppercase tracking-widest font-display text-muted-foreground hover:text-white">View Leaderboards</Button>
          </div>
        </motion.div>
      </section>

      {/* Daily Tournaments Preview */}
      <section id="tournaments" className="py-24 px-6 lg:px-16 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
            <div>
              <h2 className="text-4xl font-display font-bold uppercase tracking-widest text-glow italic">Active Missions</h2>
              <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Live tactical deployments across all regions</p>
            </div>
            <Button variant="ghost" className="text-primary text-[10px] tracking-widest uppercase font-display">View All Operatives</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments?.slice(0, 3).map((t: any) => (
              <CyberCard key={t.id} interactive glowColor="primary" className="p-0 overflow-hidden group">
                <div className="h-48 bg-black/60 relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                   <img src={t.game?.imageUrl || "/images/bgmi.png"} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="game" />
                   <div className="absolute top-4 left-4 z-20">
                      <NeonBadge color="primary">{t.type}</NeonBadge>
                   </div>
                   <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tighter text-white">{t.name}</h3>
                   </div>
                </div>
                <div className="p-6 space-y-4">
                   <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>Prize Pool</span>
                      <span className="text-primary font-bold">${t.jackpot}</span>
                   </div>
                   <div className="h-px bg-white/5 w-full" />
                   <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>Entry</span>
                      <span className="text-white">Authorized Members Only</span>
                   </div>
                   <Button onClick={handleLogin} className="w-full h-12 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent transition-all uppercase font-display tracking-widest text-[10px]">Access Briefing</Button>
                </div>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-24 px-6 lg:px-16 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-display font-bold uppercase tracking-tighter mb-8 leading-tight italic">
              Built by <span className="text-primary">Pros</span>,<br />For the <span className="text-accent">Elite</span>
            </h2>
            <div className="space-y-8">
              {[
                { icon: ShieldCheck, title: "Anti-Cheat Protocol", desc: "Military grade monitoring for fair play in every match." },
                { icon: Users, title: "Instant Matchmaking", desc: "Sophisticated ELO-based matching for balanced competition." },
                { icon: Trophy, title: "Seamless Payouts", desc: "Automated prize distribution directly to your operative wallet." }
              ].map((f, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-primary">
                    <f.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl tracking-wider uppercase mb-2">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full" />
             <CyberCard className="relative z-10 p-0 border-primary/20 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" className="w-full h-auto rounded-lg grayscale hover:grayscale-0 transition-all duration-700" alt="tech" />
             </CyberCard>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 px-6 bg-background relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: "50K+", label: "Operatives" },
              { val: "1.2M", label: "Matches" },
              { val: "$500K", label: "Awarded" },
              { val: "99.9%", label: "Uptime" }
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl lg:text-6xl font-display font-bold text-glow italic mb-2">{s.val}</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{s.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-16 border-t border-white/5 bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <Swords className="w-6 h-6" />
            <span className="font-display font-bold text-xl tracking-widest uppercase">{settings?.appName || "BATTLEROOF"}</span>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-muted-foreground font-display">
            <a href="#" className="hover:text-white transition-colors">Operations</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">© 2026 NEXUS SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
