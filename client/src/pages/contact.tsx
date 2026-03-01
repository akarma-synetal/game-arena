import PublicShell from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CyberCard } from "@/components/ui-extras";
import { MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <PublicShell
      title="Contact Us"
      subtitle="Signal HQ is online. Drop your mission details and our ops team will respond."
      backgroundImage="/images/bgmi.png"
    >
      <div className="max-w-2xl mx-auto">
        <CyberCard className="p-8 space-y-6 rounded-3xl border-white/10 bg-black/40">
          <form className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Name</Label>
              <Input id="contact-name" placeholder="Agent Name" className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</Label>
              <Input id="contact-email" type="email" placeholder="agent@battleroof.gg" className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-message" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Message</Label>
              <Textarea id="contact-message" rows={5} placeholder="Your mission details..." className="bg-white/5 border-white/10 rounded-xl focus:border-primary/60 resize-none" />
            </div>
            <Button type="button" className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary to-accent text-black font-semibold tracking-[0.4em] uppercase shadow-[0_10px_35px_rgba(255,0,153,0.35)]">
              <MessageSquare className="w-4 h-4 mr-2" /> Send Transmission
            </Button>
          </form>
        </CyberCard>
      </div>
    </PublicShell>
  );
}
