import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Swords, Zap, User, Lock, Mail, Phone, MapPin } from "lucide-react";
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
      window.location.href = isPartner ? "/partner/dashboard" : "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 lg:px-16 py-4">
        <a href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.2em] uppercase bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">BATTLEROOF</span>
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16 relative z-10">
        <div className={`w-full ${isRegister ? "max-w-2xl" : "max-w-md"}`}>
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 text-orange-400 text-[11px] uppercase tracking-[0.35em] font-display font-semibold shadow-lg shadow-orange-500/10">
              <Zap className="w-3.5 h-3.5" /> {isRegister ? "Join the Network" : isPartner ? "Partner Access" : "Access Terminal"}
            </div>
          </div>

          <div className="p-8 space-y-6 border border-white/10 bg-[#13131a]/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="space-y-2 text-center mb-8">
              <h1 className="text-4xl font-display font-bold uppercase tracking-wider bg-gradient-to-r from-orange-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
                {isRegister ? "Register" : isPartner ? "Partner Login" : "Player Login"}
              </h1>
              <p className="text-gray-400 text-sm tracking-wide">
                {isRegister
                  ? "Create your operative profile to enter the arena."
                  : isPartner
                    ? "Sign in to your hosting partner dashboard."
                    : "Sign in to your operative dashboard."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-handle"
                    autoComplete="username"
                    required
                    className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {isRegister && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ankit Kumar"
                        required={isRegister}
                        className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required={isRegister}
                        className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryCode" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Country Code</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="countryCode"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        placeholder="+91"
                        required={isRegister}
                        className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Mobile</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9876543210"
                        autoComplete="tel"
                        required={isRegister}
                        className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Gender</Label>
                    <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a24] px-4 h-12 hover:border-orange-500/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="male" id="gender-male" className="border-gray-500" />
                        <Label htmlFor="gender-male" className="text-sm text-white cursor-pointer flex-1">Male</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a24] px-4 h-12 hover:border-orange-500/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="female" id="gender-female" className="border-gray-500" />
                        <Label htmlFor="gender-female" className="text-sm text-white cursor-pointer flex-1">Female</Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a24] px-4 h-12 hover:border-orange-500/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="other" id="gender-other" className="border-gray-500" />
                        <Label htmlFor="gender-other" className="text-sm text-white cursor-pointer flex-1">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        required={isRegister}
                        className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                    className="h-12 pl-11 bg-[#1a1a24] border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display text-base font-semibold uppercase tracking-[0.3em] shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Loading..." : isRegister ? "Create Account" : isPartner ? "Enter Partner Hub" : "Enter Arena"}
              </Button>
            </form>

            <div className="border-t border-white/5 pt-6 text-sm text-gray-400 text-center">
              {isRegister ? (
                <span>Already have an account?{" "}
                  <Link href="/player" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">Login</Link>
                </span>
              ) : isPartner ? (
                <span />
              ) : (
                <span>New here?{" "}
                  <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">Register</Link>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
