import PublicShell from "@/components/public-shell";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Check } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicShell
      title="About Battleroof"
      subtitle="We build competitive arenas for BGMI, Free Fire, and Valorant operatives worldwide."
      backgroundImage="/images/freefire.webp"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CyberCard className="p-8 space-y-5 rounded-3xl border-white/10 bg-black/40">
          <NeonBadge color="primary">Mission</NeonBadge>
          <h3 className="text-3xl font-display font-semibold uppercase tracking-widest leading-tight">Forged for the elite</h3>
          <p className="text-muted-foreground text-base leading-relaxed">
            Battleroof is a battle-tested esports platform designed for players who want structured competition, daily missions, and a
            community-driven ladder. We operate across mobile and tactical FPS titles with a focus on fair play and fast matchmaking.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-2">
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
        <CyberCard className="p-8 space-y-5 rounded-3xl border-white/10 bg-black/40">
          <NeonBadge color="accent">Ops</NeonBadge>
          <h3 className="text-3xl font-display font-semibold uppercase tracking-widest leading-tight">What we deliver</h3>
          <ul className="text-muted-foreground text-base space-y-4">
            {[
              "Daily scrims with real-time brackets.",
              "Performance analytics and ELO-based ladders.",
              "Secure payouts and tournament compliance.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CyberCard>
      </div>
    </PublicShell>
  );
}
