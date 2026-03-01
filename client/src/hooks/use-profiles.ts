import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useMyProfiles() {
  return useQuery({
    queryKey: [api.profiles.me.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.me.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return await res.json();
    },
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: [api.profiles.all.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.all.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch all profiles");
      return await res.json();
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.profiles.leaderboard.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.leaderboard.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return await res.json();
    },
  });
}

export function useCreateOrUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest(api.profiles.createOrUpdate.method, api.profiles.createOrUpdate.path, data);
      return res;
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
