import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Swords, Zap } from "lucide-react";
import { PageBg, CyberCard, NeonBadge } from "@/components/ui-extras";

export default function PlayerAuthPage({ mode }: { mode: "login" | "register" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const endpoint = isRegister ? "/api/player/register" : "/api/player/login";
      const body = isRegister
        ? { username, password, inGameName }
        : { username, password };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to continue");
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PageBg image="/images/bgmi.png" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 lg:px-16 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.2em] text-glow uppercase">BATTLEROOF</span>
        </a>
        <div className="hidden md:flex items-center gap-8 uppercase text-xs tracking-[0.4em] font-display font-semibold text-muted-foreground">
          <a href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</a>
          <a href="/plans" className="hover:text-primary transition-colors">Plans</a>
          <a href="/about" className="hover:text-primary transition-colors">About</a>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] uppercase tracking-[0.35em] font-display">
              <Zap className="w-3 h-3" /> {isRegister ? "Join the Network" : "Access Terminal"}
            </div>
          </div>

          <CyberCard className="p-8 space-y-6 border-white/10 bg-black/60 backdrop-blur-xl rounded-3xl">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-4xl font-display font-semibold uppercase tracking-widest text-glow">
                {isRegister ? "Register" : "Login"}
              </h1>
              <p className="text-muted-foreground text-sm tracking-wide">
                {isRegister
                  ? "Create your operative profile to enter the arena."
                  : "Sign in to your operative dashboard."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-handle"
                  autoComplete="username"
                  required
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                />
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="inGameName" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">In-Game Name</Label>
                  <Input
                    id="inGameName"
                    value={inGameName}
                    onChange={(e) => setInGameName(e.target.value)}
                    placeholder="OperatorX"
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-black font-display text-base font-semibold uppercase tracking-[0.4em] shadow-[0_10px_35px_rgba(255,0,153,0.35)] hover:shadow-[0_10px_45px_rgba(255,0,153,0.55)] transition-all"
              >
                {isSubmitting ? "Loading..." : isRegister ? "Create Account" : "Enter Arena"}
              </Button>
            </form>

            <div className="border-t border-white/5 pt-4 text-sm text-muted-foreground text-center">
              {isRegister ? (
                <span>Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">Login</Link>
                </span>
              ) : (
                <span>New here?{" "}
                  <Link href="/register" className="text-primary hover:underline">Register</Link>
                </span>
              )}
            </div>
          </CyberCard>
        </div>
      </main>
    </div>
  );
}
