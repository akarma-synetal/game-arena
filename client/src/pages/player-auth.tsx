import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border-white/10 bg-card/70 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-display uppercase tracking-wider">
            {isRegister ? "Player Registration" : "Player Login"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Create your player account to access tournaments and squads."
              : "Sign in to access your player dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-handle"
                autoComplete="username"
                required
              />
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="inGameName">In-Game Name</Label>
                <Input
                  id="inGameName"
                  value={inGameName}
                  onChange={(e) => setInGameName(e.target.value)}
                  placeholder="OperatorX"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isRegister ? "Create Account" : "Login"}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              {isRegister ? (
                <span>
                  Already have an account? <Link href="/login" className="text-primary">Login</Link>
                </span>
              ) : (
                <span>
                  New here? <Link href="/register" className="text-primary">Register</Link>
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
