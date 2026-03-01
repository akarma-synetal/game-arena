import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Full-page background: dim image + gradient vignette */
export function PageBg({ image }: { image?: string }) {
  return (
    <>
      {image && (
        <div
          className="fixed inset-0 -z-20 bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url('${image}')` }}
        />
      )}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,0,153,0.18),_transparent_55%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(120,0,255,0.12),_transparent_55%)]" />
    </>
  );
}

/** Section header used in landing + public pages */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary font-display mb-2">{eyebrow}</p>
      )}
      <h2 className="text-5xl lg:text-6xl font-display font-semibold uppercase tracking-widest text-glow leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground mt-3 uppercase text-sm tracking-[0.4em]">{subtitle}</p>
      )}
    </div>
  );
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A highly styled gaming card with a slanted corner
export function CyberCard({ 
  children, 
  className,
  glowColor = "primary",
  interactive = false
}: { 
  children: ReactNode, 
  className?: string,
  glowColor?: "primary" | "secondary" | "accent",
  interactive?: boolean
}) {
  const glowClass = {
    primary: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] group-hover:border-primary/50",
    secondary: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--secondary)/0.4)] group-hover:border-secondary/50",
    accent: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--accent)/0.4)] group-hover:border-accent/50",
  }[glowColor];

  const beforeGlowClass = {
    primary: "bg-primary/20",
    secondary: "bg-secondary/20",
    accent: "bg-accent/20",
  }[glowColor];

  return (
    <div className={cn(
      "relative group clip-path-slant bg-card border border-white/5 p-6 transition-all duration-500",
      interactive && `cursor-pointer ${glowClass} hover:-translate-y-1`,
      className
    )}>
      {/* Decorative corner accent */}
      <div className={cn("absolute top-0 right-0 w-8 h-8 opacity-0 transition-opacity duration-500 clip-path-slant translate-x-4 -translate-y-4", 
        interactive && "group-hover:opacity-100",
        beforeGlowClass
      )} />
      
      {/* Inner content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Background gradient effect on hover */}
      {interactive && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );
}

export function NeonBadge({ children, color = "primary", className }: { children: ReactNode, color?: "primary" | "secondary" | "accent" | "muted", className?: string }) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.2)]",
    secondary: "bg-secondary/10 text-secondary border-secondary/30 shadow-[0_0_10px_hsl(var(--secondary)/0.2)]",
    accent: "bg-accent/10 text-accent border-accent/30 shadow-[0_0_10px_hsl(var(--accent)/0.2)]",
    muted: "bg-white/5 text-muted-foreground border-white/10",
  };

  return (
    <span className={cn(
      "px-3 py-1 text-xs font-display tracking-wider uppercase font-bold border rounded backdrop-blur-sm",
      colorStyles[color],
      className
    )}>
      {children}
    </span>
  );
}
