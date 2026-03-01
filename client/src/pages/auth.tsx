import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Swords, Trophy, Users, ShieldCheck, Zap, Newspaper, MessageSquare, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { CyberCard, NeonBadge, SectionHeading, PageBg } from "@/components/ui-extras";

export default function AuthPage() {
  const { data: settings } = useQuery({ queryKey: [api.settings.get.path] });
  const { data: tournaments } = useQuery({ queryKey: [api.tournaments.list.path] });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <PageBg image="/images/bgmi.png" />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.2em] text-glow uppercase">{settings?.appName || "BATTLEROOF"}</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 uppercase text-xs md:text-sm tracking-[0.4em] font-display font-semibold text-muted-foreground">
          <a href="/tournaments" className="hover:text-primary transition-colors">Tournaments</a>
          <a href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</a>
          <a href="/blogs" className="hover:text-primary transition-colors">Blogs</a>
          <a href="/plans" className="hover:text-primary transition-colors">Plans</a>
          <a href="/about" className="hover:text-primary transition-colors">About</a>
          <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          <Button
            onClick={() => { window.location.href = "/login"; }}
            variant="ghost"
            className="h-11 px-8 rounded-2xl border-2 border-primary/70 text-primary hover:bg-primary/10 tracking-[0.4em]"
          >
            Login
          </Button>
          <Button
            onClick={() => { window.location.href = "/register"; }}
            className="h-11 px-8 rounded-2xl bg-gradient-to-r from-primary to-accent text-black font-semibold tracking-[0.4em] shadow-[0_0_25px_rgba(255,0,153,0.45)]"
          >
            Register
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bgmi.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,153,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center"
        >
          <div className="text-left max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] uppercase tracking-[0.35em] font-display mb-8">
              <Zap className="w-3 h-3" /> Elite Battleground Network
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-[9rem] font-display font-semibold uppercase tracking-tight italic leading-[0.9] mb-6 pr-4 overflow-visible">
              Dominate <br />
              <span className="inline-block pb-2 pr-4 lg:pr-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary text-glow">The Grid</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground font-sans max-w-xl mb-10">
              Register for BGMI, Free Fire, and Valorant missions. Host scrims, win jackpots, and climb the global ranks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button
                onClick={() => { window.location.href = "/register"; }}
                className="h-16 px-12 text-lg font-display uppercase tracking-widest font-bold bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.18)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.6)] border-none"
              >
                Create Your Account
              </Button>
              <Button
                variant="ghost"
                onClick={() => { window.location.href = "/leaderboard"; }}
                className="h-16 px-12 text-base uppercase tracking-widest font-display text-muted-foreground hover:text-white"
              >
                View Leaderboards
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/20 blur-[120px] rounded-full" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 shadow-[0_0_60px_rgba(255,0,153,0.2)]">
              <img
                src="/images/bgmi.png"
                className="w-full h-[420px] object-contain rounded-2xl"
                alt="BGMI operative"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Daily Tournaments Preview */}
      <section id="tournaments" className="py-28 px-6 lg:px-16 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
            <SectionHeading title="Active Missions" eyebrow="Live" subtitle="Tactical deployments across all regions" />
            <Button variant="ghost" className="text-primary text-[10px] tracking-widest uppercase font-display shrink-0">View All</Button>
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
                   <div className="flex justify-between items-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>Prize Pool</span>
                      <span className="text-primary font-bold">${t.jackpot}</span>
                   </div>
                   <div className="h-px bg-white/5 w-full" />
                   <div className="flex justify-between items-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>Entry</span>
                      <span className="text-white">Authorized Members Only</span>
                   </div>
                   <Button onClick={() => { window.location.href = "/login"; }} className="w-full h-12 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent transition-all uppercase font-display tracking-widest text-[10px]">Access Briefing</Button>
                </div>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-28 px-6 lg:px-16 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-6xl font-display font-bold uppercase tracking-tighter mb-8 leading-tight italic">
              Built by <span className="text-primary">Pros</span>,<br />For the <span className="text-accent">Elite</span>
            </h2>
            <div className="space-y-8">
              {[
                { icon: ShieldCheck, title: "Anti-Cheat Protocol", desc: "Military grade monitoring for fair play in every match." },
                { icon: Users, title: "Instant Matchmaking", desc: "Sophisticated ELO-based matching for balanced competition." },
                { icon: Trophy, title: "Seamless Payouts", desc: "Automated prize distribution directly to your operative wallet." }
              ].map((f, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-primary">
                    <f.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl tracking-wider uppercase mb-2">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full" />
             <CyberCard className="relative z-10 p-0 border-primary/20 shadow-2xl">
                <img src="/images/freefire.webp" className="w-full h-[420px] object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-700" alt="gaming rig" />
             </CyberCard>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: "50K+", label: "Operatives" },
              { val: "1.2M", label: "Matches" },
              { val: "$500K", label: "Awarded" },
              { val: "99.9%", label: "Uptime" }
            ].map((s, i) => (
              <div key={i}>
                <p className="text-5xl lg:text-7xl font-display font-bold text-glow italic mb-2">{s.val}</p>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{s.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="py-28 px-6 lg:px-16 bg-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <SectionHeading title="Subscription Plans" subtitle="Choose your loadout" />
            <Button variant="ghost" onClick={() => { window.location.href = "/plans"; }} className="text-primary text-[10px] tracking-widest uppercase font-display shrink-0">See All Plans</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rookie", price: "Free", perks: ["Ranked access", "Basic scrims", "Starter badges"] },
              { name: "Pro", price: "₹450/mo", perks: ["Priority scrims", "Advanced stats", "Seasonal rewards"] },
              { name: "Elite", price: "₹1,250/mo", perks: ["VIP tournaments", "Coach review", "Exclusive drops"] }
            ].map((plan) => (
              <CyberCard
                key={plan.name}
                glowColor="primary"
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-black/50 p-8 shadow-[0_0_40px_rgba(255,0,153,0.12)] space-y-6"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />
                <div className="relative flex items-center justify-between">
                  <h3 className="text-3xl font-display uppercase tracking-[0.4em]">{plan.name}</h3>
                  <NeonBadge color="primary" className="tracking-[0.4em] text-xs">{plan.price}</NeonBadge>
                </div>
                <ul className="relative space-y-3 text-muted-foreground text-xl">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(255,0,153,0.5)]" />
                      <span className="tracking-wide">{perk}</span>
                    </li>
                  ))}
                </ul>
                <Button className="relative mt-4 w-full h-14 rounded-2xl border-2 border-white/15 bg-gradient-to-r from-primary to-accent text-black font-display text-lg tracking-[0.35em] uppercase shadow-[0_10px_35px_rgba(255,0,153,0.35)]">
                  Select Plan
                </Button>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section id="blogs" className="py-28 px-6 lg:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <SectionHeading title="Battlelog Stories" subtitle="Tactics, highlights, and pro tips" />
            <Button variant="ghost" onClick={() => { window.location.href = "/blogs"; }} className="text-primary text-[10px] tracking-widest uppercase font-display shrink-0">Read More</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "BGMI Drop Zones", tag: "Guide", excerpt: "Best landing spots and rotation routes for fast loot." },
              { title: "Valorant Aim Labs", tag: "Training", excerpt: "Three drills to sharpen your flicks and crosshair placement." },
              { title: "Free Fire Meta", tag: "Patch", excerpt: "Top weapons and character combos for this season." }
            ].map((post) => (
              <CyberCard key={post.title} interactive className="p-6 space-y-4">
                <NeonBadge color="accent">{post.tag}</NeonBadge>
                <h3 className="text-xl font-display font-bold uppercase tracking-wider leading-snug">{post.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{post.excerpt}</p>
                <Button variant="ghost" className="justify-start px-0 text-primary uppercase tracking-widest text-xs">
                  <Newspaper className="w-4 h-4 mr-2" /> Read briefing
                </Button>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* About & Contact */}
      <section id="about" className="py-28 px-6 lg:px-16 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* About card */}
          <CyberCard className="p-8 space-y-5 rounded-3xl border-white/10 bg-black/40">
            <NeonBadge color="primary">About Us</NeonBadge>
            <h3 className="text-4xl font-display font-semibold uppercase tracking-widest leading-tight">Built For Champions</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Battleroof is a tactical esports hub for BGMI, Free Fire, and Valorant. We run daily missions, coach-led scrims, and
              community-driven leagues that keep every operative sharp.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <p className="text-4xl font-display font-semibold text-primary">120+</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-1">Weekly Events</p>
              </div>
              <div>
                <p className="text-4xl font-display font-semibold text-primary">24/7</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-1">Matchmaking</p>
              </div>
            </div>
          </CyberCard>
          {/* Contact card */}
          <CyberCard className="p-8 space-y-5 rounded-3xl border-white/10 bg-black/40" id="contact">
            <NeonBadge color="accent">Contact Us</NeonBadge>
            <h3 className="text-4xl font-display font-semibold uppercase tracking-widest leading-tight">Signal HQ</h3>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Name</Label>
                <Input id="contact-name" placeholder="Agent Name" className="h-11 bg-white/5 border-white/10 rounded-xl focus:border-primary/60" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</Label>
                <Input id="contact-email" type="email" placeholder="agent@battleroof.gg" className="h-11 bg-white/5 border-white/10 rounded-xl focus:border-primary/60" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Message</Label>
                <Textarea id="contact-message" rows={4} placeholder="Your mission details..." className="bg-white/5 border-white/10 rounded-xl focus:border-primary/60 resize-none" />
              </div>
              <Button type="button" className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-accent text-black font-semibold tracking-widest">
                <MessageSquare className="w-4 h-4 mr-2" /> Send Transmission
              </Button>
            </form>
          </CyberCard>
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
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/blogs" className="hover:text-white transition-colors">Blogs</a>
            <a href="/plans" className="hover:text-white transition-colors">Plans</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">© 2026 NEXUS SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
