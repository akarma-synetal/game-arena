import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useTournaments() {
  return useQuery({
    queryKey: [api.tournaments.list.path],
    queryFn: async () => {
      const res = await fetch(api.tournaments.list.path);
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return await res.json();
    }
  });
}

export function useTournament(id: number) {
  return useQuery({
    queryKey: [buildUrl(api.tournaments.get.path, { id })],
    queryFn: async () => {
      const res = await fetch(buildUrl(api.tournaments.get.path, { id }));
      if (!res.ok) throw new Error("Failed to fetch tournament");
      return await res.json();
    },
    enabled: !!id
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", api.tournaments.create.path, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      toast({ title: "Tournament Created" });
    }
  });
}

export function useRegisterTournament(tournamentId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { teamId: number }) => {
      const url = buildUrl(api.tournaments.register.path, { id: tournamentId });
      const res = await apiRequest("POST", url, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      toast({ title: "Registered!", description: "Your squad is deployed." });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to register", description: error.message, variant: "destructive" });
    }
  });
}
