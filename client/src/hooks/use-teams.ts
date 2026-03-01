import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useTeams() {
  return useQuery({
    queryKey: [api.teams.list.path],
    queryFn: async () => {
      const res = await fetch(api.teams.list.path);
      if (!res.ok) throw new Error("Failed to fetch teams");
      return await res.json();
    }
  });
}

export function useMyTeams() {
  return useQuery({
    queryKey: [api.teams.myTeams.path],
    queryFn: async () => {
      const res = await fetch(api.teams.myTeams.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch my teams");
      return await res.json();
    }
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest(api.teams.create.method, api.teams.create.path, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.teams.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.teams.myTeams.path] });
      toast({ title: "Squad Formed", description: "Your new squad is ready for deployment." });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to form squad", description: error.message, variant: "destructive" });
    }
  });
}
