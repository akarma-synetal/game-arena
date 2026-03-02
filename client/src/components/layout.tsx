import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAdminTab } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Swords, 
  LogOut, 
  Menu, 
  LayoutDashboard,
  Bell,
  ShieldAlert,
  Gift,
  Target,
  Zap,
  Settings,
  Crown,
  Shield,
  Layers,
  BarChart3
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
  const { data: settings } = useQuery({ queryKey: [api.settings.get.path] });
  const { data: profile } = useQuery({ queryKey: [api.profiles.me.path] });
  const { data: roleData } = useQuery<{ role: "player" | "partner" | "admin" }>({
    queryKey: ["/api/auth/role"],
    queryFn: async () => {
      const response = await fetch("/api/auth/role", { credentials: "include" });
      if (!response.ok) throw new Error("Role unavailable");
      return response.json();
    },
    retry: false,
  });

  const role = roleData?.role || (profile?.isAdmin ? "admin" : "player");

  const navItems = role === "admin"
    ? [
        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Gamepad2 },
        { href: "/tournaments", label: "Tournaments", icon: Trophy },
        { href: "/teams", label: "Teams", icon: Users },
      ]
    : role === "partner"
      ? [
          { href: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/tournaments", label: "Tournaments", icon: Trophy },
          { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Gamepad2 },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/tournaments", label: "Tournaments", icon: Trophy },
          { href: "/teams", label: "Squads", icon: Users },
          { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Gamepad2 },
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        );
      })}
    </div>
  );

  const AdminTabsMenu = () => {
    const { activeTab, setActiveTab } = useAdminTab();
    
    const adminTabs = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "partners", label: "Partners", icon: Crown },
      { id: "players", label: "Players", icon: Users },
      { id: "teams", label: "Teams", icon: Shield },
      { id: "tournaments", label: "Tournaments", icon: Trophy },
      { id: "leaderboard", label: "Leaderboards", icon: Layers },
      { id: "subscriptions", label: "Subscription Plans", icon: Gift },
      { id: "settings", label: "Settings", icon: Settings },
    ];

    if (role !== "admin") return null;

    return (
      <div className="mb-6 space-y-2 pb-6 border-b border-white/10">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold px-2 mb-3">Admin Menu</p>
        {adminTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-base font-display tracking-wide h-12 relative group overflow-hidden",
                isActive
                  ? "text-primary bg-primary/10 hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-admin-tab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary box-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <tab.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {tab.label}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden selection:bg-primary/30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 glass-panel z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center box-glow">
            <Swords className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-xl tracking-widest text-glow">{settings?.appName || "BATTLEROOF"}</span>
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
              <span className="font-display font-bold text-2xl tracking-widest text-glow">{settings?.appName || "BATTLEROOF"}</span>
            </div>
            <AdminTabsMenu />
            {role !== "admin" && <NavLinks />}
            <div className="mt-auto">
              <Button onClick={() => logout()} variant="outline" className="w-full gap-2 border-white/10 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 transition-all font-display uppercase tracking-widest text-xs">
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
            <h1 className="font-display font-bold text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 uppercase">{settings?.appName || "BATTLEROOF"}</h1>
            <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-semibold">Elite Platform</p>
          </div>
        </div>

        {/* Player Stats Section */}
        {role === "player" && profile && (
          <div className="mb-6 space-y-3 pb-6 border-b border-white/10">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold px-2 mb-3">Quick Stats</p>
            
            {/* ELO Card */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 hover:bg-primary/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Rating</span>
                </div>
                <span className="text-lg font-bold text-primary">{profile.elo || 1000}</span>
              </div>
            </div>

            {/* Deployments Card */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 hover:bg-secondary/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Matches</span>
                </div>
                <span className="text-lg font-bold text-secondary">{profile.matchesPlayed || 0}</span>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 hover:bg-accent/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Tier</span>
                </div>
                <span className="text-xs font-bold text-accent uppercase">{profile.subscriptionTier || "Free"}</span>
              </div>
            </div>

            {/* Followers Card */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 hover:bg-primary/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Followers</span>
                </div>
                <span className="text-lg font-bold text-primary">{Math.max(100, Math.floor((profile.elo || 1000) / 4))}</span>
              </div>
            </div>

            {/* Following Card */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 hover:bg-secondary/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Following</span>
                </div>
                <span className="text-lg font-bold text-secondary">{Math.max(40, Math.floor((profile.matchesPlayed || 0) / 3))}</span>
              </div>
            </div>
          </div>
        )}
        
        <AdminTabsMenu />
        {role !== "admin" && <NavLinks />}

        {user && (
          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="border-2 border-primary/20">
                <AvatarImage src={user.profileImageUrl || ""} />
                <AvatarFallback className="bg-muted text-primary">{user.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="font-medium text-sm truncate uppercase tracking-tight font-display">{user.firstName}</span>
                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">{profile?.subscriptionTier || "Free"}</span>
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
        <header className="hidden md:flex h-20 items-center justify-end px-8 border-b border-white/5 bg-background/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary box-glow"></span>
            </Button>
            <Button className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all duration-300 font-display uppercase tracking-wide px-6">
              Instant Match
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
