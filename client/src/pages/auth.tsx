import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Swords, Trophy, Gamepad2 } from "lucide-react";

export default function AuthPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden text-foreground">
      {/* Left Panel - Branding/Hero */}
      <div className="lg:w-[55%] relative flex flex-col justify-between p-8 lg:p-16 border-r border-white/5">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/20" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <span className="font-display font-bold text-3xl tracking-[0.2em] text-glow">NEXUS</span>
        </div>

        <div className="relative z-10 mt-20 lg:mt-0 max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-7xl font-display font-bold uppercase leading-tight tracking-tight mb-6"
          >
            Dominate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">The Arena</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground font-sans leading-relaxed mb-12"
          >
            The ultimate tournament hosting platform for BGMI, FreeFire, and Valorant. 
            Build your team, enter tournaments, crush your rivals, and claim the jackpot.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 lg:gap-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-primary">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wider">Compete</h3>
                <p className="text-sm text-muted-foreground">Daily cash tournaments</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-secondary">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wider">Challenge</h3>
                <p className="text-sm text-muted-foreground">1v1 / Team Wagers</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-20 lg:mt-0 flex items-center justify-between text-sm text-muted-foreground font-display tracking-widest">
          <span>© 2025 NEXUS ESPORTS</span>
          <span className="text-primary text-glow animate-pulse">SYSTEM_ONLINE</span>
        </div>
      </div>

      {/* Right Panel - Login Action */}
      <div className="lg:w-[45%] flex items-center justify-center p-8 lg:p-16 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-10 clip-path-slant shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold tracking-widest uppercase mb-2">Access Node</h2>
            <p className="text-muted-foreground text-sm">Authenticate via Replit to enter the platform</p>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full h-14 text-lg font-display uppercase tracking-widest font-bold bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
          >
            Login / Initialize
          </Button>
          
          <p className="text-center text-xs text-muted-foreground mt-8">
            By authenticating, you agree to the <a href="#" className="text-primary hover:underline">Rules of Engagement</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
