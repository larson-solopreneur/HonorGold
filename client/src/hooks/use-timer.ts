import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TimerSession } from "@db/schema";

export function useTimer() {
  const queryClient = useQueryClient();

  const { data: history } = useQuery<TimerSession[]>({
    queryKey: ["timer-history"],
    queryFn: async () => {
      const response = await fetch("/api/timer/history", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch timer history");
      }
      return response.json();
    },
  });

  const startTimer = useMutation({
    mutationFn: async (isAbstinence: boolean) => {
      const response = await fetch("/api/timer/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isAbstinence }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to start timer");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timer-history"] });
    },
  });

  const endTimer = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/timer/end", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to end timer");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timer-history"] });
    },
  });

  return {
    history,
    startTimer: startTimer.mutateAsync,
    endTimer: endTimer.mutateAsync,
  };
}
