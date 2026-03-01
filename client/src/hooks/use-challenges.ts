import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMyChallenges() {
  return useQuery({
    queryKey: [api.challenges.myChallenges.path],
    queryFn: async () => {
      const res = await fetch(api.challenges.myChallenges.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return api.challenges.myChallenges.responses[200].parse(await res.json());
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.challenges.create.path, {
        method: api.challenges.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create challenge");
      }
      return api.challenges.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.challenges.myChallenges.path] });
      toast({ title: "Challenge Sent", description: "Your opponent has been notified." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}
