import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { CyberCard, NeonBadge } from "@/components/ui-extras";
import { Shield, Plus, Users, Trophy, Settings, Users as UsersIcon, Gamepad, Gift, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appSettings } = useQuery({ queryKey: [api.settings.get.path] });
  const { data: allProfiles } = useQuery({ queryKey: [api.profiles.all.path] });
  const { data: allTournaments } = useQuery({ queryKey: [api.tournaments.list.path] });
  const { data: allTeams } = useQuery({ queryKey: [api.teams.list.path] });
  const { data: allGames } = useQuery({ queryKey: [api.games.list.path] });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => await apiRequest("POST", api.settings.update.path, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.settings.get.path] });
      toast({ title: "Success", description: "Settings updated" });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: any }) => 
      await apiRequest("PATCH", buildUrl(api.profiles.update.path, { id }), updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.profiles.all.path] })
  });

  const updateTournamentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: any }) => 
      await apiRequest("PATCH", buildUrl(api.tournaments.update.path, { id }), updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] })
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: any }) => 
      await apiRequest("PATCH", buildUrl(api.teams.update.path, { id }), updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.teams.list.path] })
  });

  if (!user) return <div className="p-8 text-center">Unauthorized</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-glow">
          Command Center: {appSettings?.appName || "Battleroof"}
        </h1>
        <NeonBadge color="primary">Admin Level 100</NeonBadge>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="bg-card/50 border border-white/10 w-full justify-start p-1 h-auto mb-8">
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary uppercase text-xs tracking-widest py-3 px-6"><Settings className="w-4 h-4 mr-2"/> General</TabsTrigger>
          <TabsTrigger value="players" className="data-[state=active]:bg-secondary uppercase text-xs tracking-widest py-3 px-6"><UsersIcon className="w-4 h-4 mr-2"/> Operatives</TabsTrigger>
          <TabsTrigger value="tournaments" className="data-[state=active]:bg-accent uppercase text-xs tracking-widest py-3 px-6"><Trophy className="w-4 h-4 mr-2"/> Missions</TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-primary uppercase text-xs tracking-widest py-3 px-6"><Shield className="w-4 h-4 mr-2"/> Squads</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <CyberCard glowColor="primary" className="max-w-2xl">
            <h2 className="text-2xl font-display mb-6 uppercase tracking-wider">System Configuration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Platform Designation</label>
                <div className="flex gap-2">
                  <Input 
                    defaultValue={appSettings?.appName}
                    id="appName"
                    className="bg-background border-white/10"
                  />
                  <Button onClick={() => {
                    const val = (document.getElementById('appName') as HTMLInputElement).value;
                    updateSettingsMutation.mutate({ appName: val });
                  }}>Update</Button>
                </div>
              </div>
            </div>
          </CyberCard>
        </TabsContent>

        <TabsContent value="players">
          <CyberCard className="p-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="uppercase text-[10px] tracking-widest">Operative</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest">IGN</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest">Tier</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProfiles?.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.userId.substring(0,8)}...</TableCell>
                    <TableCell className="text-primary font-bold">{p.inGameName}</TableCell>
                    <TableCell><NeonBadge color="accent">{p.subscriptionTier}</NeonBadge></TableCell>
                    <TableCell>{p.isBlocked ? <span className="text-destructive">Terminated</span> : <span className="text-green-500">Active</span>}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => updateProfileMutation.mutate({ id: p.id, updates: { isBlocked: !p.isBlocked } })}
                      >
                        {p.isBlocked ? "Restore" : "Terminate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CyberCard>
        </TabsContent>

        <TabsContent value="tournaments">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTournaments?.map((t: any) => (
              <CyberCard key={t.id} glowColor={t.status === 'registration_opened' ? 'primary' : 'muted'}>
                <h3 className="text-xl font-bold mb-2 uppercase">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 uppercase">{t.type} | {t.status}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => updateTournamentMutation.mutate({ id: t.id, updates: { status: 'published' } })}>Publish</Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => updateTournamentMutation.mutate({ id: t.id, updates: { status: 'finished' } })}>Finish</Button>
                </div>
              </CyberCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <CyberCard className="p-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="uppercase text-[10px] tracking-widest">Squad Name</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest">Type</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest">ELO</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTeams?.map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-bold text-secondary">{t.name}</TableCell>
                    <TableCell className="uppercase text-xs">{t.type}</TableCell>
                    <TableCell>{t.elo}</TableCell>
                    <TableCell>{t.isBlocked ? <span className="text-destructive">Blocked</span> : <span className="text-green-500">Authorized</span>}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => updateTeamMutation.mutate({ id: t.id, updates: { isBlocked: !t.isBlocked } })}
                      >
                        {t.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CyberCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
