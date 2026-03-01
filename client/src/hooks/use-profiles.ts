import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMyProfiles() {
  return useQuery({
    queryKey: [api.profiles.me.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.me.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return api.profiles.me.responses[200].parse(await res.json());
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.profiles.leaderboard.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.leaderboard.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return api.profiles.leaderboard.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOrUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.profiles.createOrUpdate.path, {
        method: api.profiles.createOrUpdate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save profile");
      }
      return api.profiles.createOrUpdate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profiles.me.path] });
      toast({ title: "Profile Updated", description: "Your gaming profile is saved." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}
