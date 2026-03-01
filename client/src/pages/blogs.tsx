import PublicShell from "@/components/public-shell";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "BGMI Drop Zone Handbook",
    tag: "Guide",
    tagColor: "primary" as const,
    excerpt: "Hot drop, safe drop, or stealth? Master the early rotations and loot flow.",
    date: "Mar 01, 2026",
  },
  {
    title: "Valorant Aim Labs",
    tag: "Training",
    tagColor: "accent" as const,
    excerpt: "Three daily drills to lock your crosshair and win the duel before it starts.",
    date: "Feb 18, 2026",
  },
  {
    title: "Free Fire Meta Update",
    tag: "Patch",
    tagColor: "secondary" as const,
    excerpt: "Best character synergy and weapon loadouts for this season.",
    date: "Feb 02, 2026",
  },
];

export default function BlogsPage() {
  return (
    <PublicShell
      title="Battlelog Stories"
      subtitle="Tactical writeups, operator interviews, and mission recaps from the Battleroof network."
      backgroundImage="/images/bgmi.png"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <CyberCard key={post.title} interactive className="p-6 space-y-4 rounded-3xl border-white/10 bg-black/40">
            <div className="flex items-center justify-between">
              <NeonBadge color={post.tagColor}>{post.tag}</NeonBadge>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{post.date}</span>
            </div>
            <h3 className="text-xl font-display font-bold uppercase tracking-wider leading-snug">{post.title}</h3>
            <p className="text-muted-foreground text-base leading-relaxed">{post.excerpt}</p>
            <Button variant="ghost" className="px-0 text-primary uppercase tracking-widest text-xs">
              <Newspaper className="w-4 h-4 mr-2" /> Read briefing
            </Button>
          </CyberCard>
        ))}
      </div>
    </PublicShell>
  );
}
