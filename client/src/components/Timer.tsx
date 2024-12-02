import { Button } from "@/components/ui/button";
import { useTimer } from "../hooks/use-timer";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export function Timer() {
  const { startTimer, endTimer, activeSession } = useTimer();
  const { toast } = useToast();
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (activeSession?.startTime && !activeSession.endTime) {
      try {
        const startTime = new Date(activeSession.startTime);
        const updateElapsedTime = () => {
          const now = new Date();
          const elapsed = now.getTime() - startTime.getTime();
          setElapsedTime(Math.max(0, elapsed));
          
          // ローカルストレージに現在の経過時間を保存
          localStorage.setItem('timerElapsedTime', elapsed.toString());
        };
        
        // ローカルストレージから以前の状態を復元
        const storedElapsedTime = localStorage.getItem('timerElapsedTime');
        if (storedElapsedTime) {
          setElapsedTime(parseInt(storedElapsedTime, 10));
        }

        updateElapsedTime();
        intervalId = setInterval(updateElapsedTime, 1000);

        // タイマー状態をローカルストレージに保存
        localStorage.setItem('timerStartTime', startTime.toISOString());
        localStorage.setItem('timerSessionId', activeSession.id.toString());
        localStorage.setItem('timerIsAbstinence', String(activeSession.isAbstinence));
      } catch (error) {
        console.error("タイマー更新エラー:", error);
        setElapsedTime(0);
        clearTimerStorage();
      }
    } else {
      setElapsedTime(0);
      clearTimerStorage();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeSession]);

  // タイマーストレージをクリアする関数
  const clearTimerStorage = () => {
    localStorage.removeItem('timerStartTime');
    localStorage.removeItem('timerSessionId');
    localStorage.removeItem('timerIsAbstinence');
    localStorage.removeItem('timerElapsedTime');
  };

  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return `${days}日 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      await startTimer(true);
      toast({
        title: "継続モード開始",
        description: "タイマーを開始しました。頑張りましょう！",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "タイマーの開始に失敗しました",
      });
    }
  };

  const handleFailure = async () => {
    try {
      if (activeSession && !activeSession.endTime) {
        await endTimer();
      }
      await startTimer(false);
      toast({
        title: "失敗を記録",
        description: "記録を保存しました。また頑張りましょう。",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "失敗の記録に失敗しました",
      });
    }
  };

  const isTimerActive = Boolean(activeSession?.startTime && !activeSession?.endTime);

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold mb-2">
          <Clock className="h-6 w-6" />
          タイマー管理
        </h2>
        <p className="text-4xl font-mono mb-2">
          {formatElapsedTime(elapsedTime)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-24"
          onClick={handleStart}
          disabled={isTimerActive}
        >
          <ShieldCheck className="h-6 w-6 mr-2" />
          継続を開始
        </Button>

        <Button
          size="lg"
          variant="destructive"
          className="h-24"
          onClick={handleFailure}
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          失敗を記録
        </Button>
      </div>
    </div>
  );
}
