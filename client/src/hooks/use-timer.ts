import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TimerSession } from "@db/schema";

export function useTimer() {
  const queryClient = useQueryClient();

  const { data: history } = useQuery<TimerSession[]>({
    queryKey: ["timer-history"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/timer/history", {
          credentials: "include",
          headers: {
            "Accept": "application/json",
          },
        });
        
        if (response.status === 401) {
          window.location.href = "/"; // 認証切れの場合はログインページにリダイレクト
          return [];
        }
        
        if (!response.ok) {
          throw new Error("タイマー履歴の取得に失敗しました");
        }
        
        return response.json();
      } catch (error) {
        console.error("履歴取得エラー:", error);
        return [];
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // 30秒間はキャッシュを使用
  });

  const { data: activeSession } = useQuery<TimerSession | null>({
    queryKey: ["active-timer"],
    queryFn: async () => {
      try {
        // ローカルストレージからセッションIDを取得
        const storedSessionId = localStorage.getItem('timerSessionId');
        
        const response = await fetch("/api/timer/active", {
          credentials: "include",
          headers: {
            "Accept": "application/json",
          },
        });
        
        if (response.status === 401) {
          window.location.href = "/";
          return null;
        }
        
        if (!response.ok) {
          throw new Error("アクティブなタイマーの取得に失敗しました");
        }
        
        const data = await response.json();
        
        // アクティブセッションがない場合、ローカルストレージをクリア
        if (!data && storedSessionId) {
          localStorage.removeItem('timerStartTime');
          localStorage.removeItem('timerSessionId');
          localStorage.removeItem('timerIsAbstinence');
          localStorage.removeItem('timerElapsedTime');
        }
        
        return data;
      } catch (error) {
        console.error("タイマー取得エラー:", error);
        return null;
      }
    },
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 2000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: true,
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
        throw new Error("タイマーの開始に失敗しました");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timer-history"] });
      queryClient.invalidateQueries({ queryKey: ["active-timer"] });
    },
  });

  const endTimer = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/timer/end", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("タイマーの終了に失敗しました");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timer-history"] });
      queryClient.invalidateQueries({ queryKey: ["active-timer"] });
    },
  });

  return {
    history,
    activeSession,
    startTimer: startTimer.mutateAsync,
    endTimer: endTimer.mutateAsync,
  };
}
