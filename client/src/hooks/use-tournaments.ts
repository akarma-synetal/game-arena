import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTournaments() {
  return useQuery({
    queryKey: [api.tournaments.list.path],
    queryFn: async () => {
      const res = await fetch(api.tournaments.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return api.tournaments.list.responses[200].parse(await res.json());
    },
  });
}

export function useTournament(id: number) {
  return useQuery({
    queryKey: [api.tournaments.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tournaments.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch tournament");
      return api.tournaments.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useRegisterTournament(tournamentId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ teamId }: { teamId: number }) => {
      const url = buildUrl(api.tournaments.register.path, { id: tournamentId });
      const res = await fetch(url, {
        method: api.tournaments.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return api.tournaments.register.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tournaments.get.path, tournamentId] });
      toast({
        title: "Registration Successful",
        description: "Your team has been entered into the tournament.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
