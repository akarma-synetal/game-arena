import PublicShell from "@/components/public-shell";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Rookie",
    price: "Free",
    perks: ["Ranked access", "Basic scrims", "Starter badges"],
  },
  {
    name: "Pro",
    price: "₹450/mo",
    perks: ["Priority scrims", "Advanced stats", "Seasonal rewards"],
  },
  {
    name: "Elite",
    price: "₹1,250/mo",
    perks: ["VIP tournaments", "Coach review", "Exclusive drops"],
  },
];

export default function PlansPage() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % plans.length);
  const prev = () => setCurrent((current - 1 + plans.length) % plans.length);

  return (
    <PublicShell
      title="Subscription Plans"
      subtitle="Choose your loadout and unlock competitive advantages across every mission tier."
      backgroundImage="/images/freefire.webp"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Carousel */}
        <div className="w-full max-w-2xl">
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
              {plans.map((plan) => (
                <div key={plan.name} className="w-full flex-shrink-0 px-1">
                  <CyberCard glowColor="primary" className="p-8 space-y-6 rounded-3xl border-white/10 bg-black/50 h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-display font-semibold uppercase tracking-[0.4em]">{plan.name}</h3>
                      <NeonBadge color="primary">{plan.price}</NeonBadge>
                    </div>
                    <ul className="space-y-3 text-muted-foreground text-base">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary shrink-0 drop-shadow-[0_0_5px_rgba(255,0,153,0.5)]" />
                          <span className="tracking-wide">{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-black font-display text-base font-semibold uppercase tracking-[0.35em] shadow-[0_10px_35px_rgba(255,0,153,0.35)]">
                      Select Plan
                    </Button>
                  </CyberCard>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <Button variant="outline" size="icon" onClick={prev} className="w-12 h-12 rounded-full border-primary/50 hover:bg-primary/10">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex gap-2">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-8" : "bg-white/20"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="w-12 h-12 rounded-full border-primary/50 hover:bg-primary/10">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Info */}
          <p className="text-center text-muted-foreground text-sm mt-8 uppercase tracking-[0.2em]">
            {current + 1} of {plans.length}
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
