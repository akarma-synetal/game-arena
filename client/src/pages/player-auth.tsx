import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Swords, Zap } from "lucide-react";
import { PageBg, CyberCard } from "@/components/ui-extras";

export default function PlayerAuthPage({ mode }: { mode: "login" | "register" | "partner" }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";
  const isPartner = mode === "partner";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (isRegister && !gender) {
      setError("Please select a gender");
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = isRegister ? "/api/player/register" : isPartner ? "/api/partner/login" : "/api/player/login";
      const body = isRegister
        ? {
            username,
            password,
            fullName,
            email,
            countryCode,
            mobile,
            gender,
            city,
            inGameName: fullName || username,
          }
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

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 lg:px-16 py-4">
        <a href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.2em] text-glow uppercase">BATTLEROOF</span>
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
        <div className={`w-full ${isRegister ? "max-w-2xl" : "max-w-md"}`}>
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] uppercase tracking-[0.35em] font-display">
              <Zap className="w-3 h-3" /> {isRegister ? "Join the Network" : isPartner ? "Partner Access" : "Access Terminal"}
            </div>
          </div>

          <CyberCard className="p-8 space-y-6 border-white/10 bg-black/60 backdrop-blur-xl rounded-3xl">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-4xl font-display font-semibold uppercase tracking-widest text-glow">
                {isRegister ? "Register" : isPartner ? "Partner Login" : "Player Login"}
              </h1>
              <p className="text-muted-foreground text-sm tracking-wide">
                {isRegister
                  ? "Create your operative profile to enter the arena."
                  : isPartner
                    ? "Sign in to your hosting partner dashboard."
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ankit Kumar"
                      required={isRegister}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required={isRegister}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryCode" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Country Code</Label>
                    <Input
                      id="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      placeholder="+91"
                      required={isRegister}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mobile</Label>
                    <Input
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9876543210"
                      autoComplete="tel"
                      required={isRegister}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Gender</Label>
                    <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 h-12">
                        <RadioGroupItem value="male" id="gender-male" />
                        <Label htmlFor="gender-male" className="text-sm text-white cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 h-12">
                        <RadioGroupItem value="female" id="gender-female" />
                        <Label htmlFor="gender-female" className="text-sm text-white cursor-pointer">Female</Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 h-12">
                        <RadioGroupItem value="other" id="gender-other" />
                        <Label htmlFor="gender-other" className="text-sm text-white cursor-pointer">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      required={isRegister}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/60"
                    />
                  </div>
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
                {isSubmitting ? "Loading..." : isRegister ? "Create Account" : isPartner ? "Enter Partner Hub" : "Enter Arena"}
              </Button>
            </form>

            <div className="border-t border-white/5 pt-4 text-sm text-muted-foreground text-center">
              {isRegister ? (
                <span>Already have an account?{" "}
                  <Link href="/player" className="text-primary hover:underline">Login</Link>
                </span>
              ) : isPartner ? (
                <span />
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
