import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { PageBg } from "@/components/ui-extras";

export default function PublicShell({
  title,
  subtitle,
  backgroundImage,
  children,
}: {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children: ReactNode;
}) {
  const { data: settings } = useQuery({ queryKey: [api.settings.get.path] });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageBg image={backgroundImage} />
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.2em] text-glow uppercase">
            {settings?.appName || "BATTLEROOF"}
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-8 uppercase text-xs md:text-sm tracking-[0.4em] font-display font-semibold text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="/#leaderboard" className="hover:text-primary transition-colors">Leaderboard</a>
          <a href="/#blogs" className="hover:text-primary transition-colors">Blogs</a>
          <a href="/#plans" className="hover:text-primary transition-colors">Plans</a>
          <a href="/#about" className="hover:text-primary transition-colors">About</a>
          <a href="/#contact" className="hover:text-primary transition-colors">Contact</a>
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

      <header className="relative pt-32 pb-12 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary font-display">Battleroof Network</p>
          <h1 className="text-5xl lg:text-7xl font-display font-semibold uppercase tracking-widest text-glow mt-3 leading-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-lg mt-4 max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>
      </header>

      <main className="px-6 lg:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
