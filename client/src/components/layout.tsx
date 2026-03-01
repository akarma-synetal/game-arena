import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Swords, 
  LogOut, 
  Menu, 
  LayoutDashboard,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/leaderboard", label: "Leaderboard", icon: Gamepad2 },
    { href: "/challenges", label: "Challenges", icon: Swords },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex flex-col gap-2 w-full mt-8">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} className="w-full">
            <Button
              variant="ghost"
              onClick={onClick}
              className={cn(
                "w-full justify-start gap-4 text-lg font-display tracking-wide h-12 relative group overflow-hidden",
                isActive 
                  ? "text-primary bg-primary/10 hover:bg-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary box-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
              
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden selection:bg-primary/30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 glass-panel z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center box-glow">
            <Swords className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-xl tracking-widest text-glow">NEXUS</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card/95 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center box-glow">
                <Swords className="w-6 h-6 text-black" />
              </div>
              <span className="font-display font-bold text-2xl tracking-widest text-glow">NEXUS</span>
            </div>
            <NavLinks />
            <div className="mt-auto">
              <Button onClick={() => logout()} variant="outline" className="w-full gap-2 border-white/10 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 glass-panel border-r border-white/5 p-6 z-10 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">NEXUS</h1>
            <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-semibold">Tournament Hub</p>
          </div>
        </div>
        
        <NavLinks />

        {user && (
          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="border-2 border-primary/20">
                <AvatarImage src={user.profileImageUrl || ""} />
                <AvatarFallback className="bg-muted text-primary">{user.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="font-medium text-sm truncate">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-73px)] md:h-screen overflow-hidden relative">
        {/* Top bar for desktop */}
        <header className="hidden md:flex h-20 items-center justify-end px-8 border-b border-white/5 bg-background/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary box-glow"></span>
            </Button>
            <Button className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all duration-300 font-display uppercase tracking-wide">
              Create Match
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-0 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
