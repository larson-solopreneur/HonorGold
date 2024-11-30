import { Button } from "@/components/ui/button";
import { useTimer } from "../hooks/use-timer";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export function Timer() {
  const { startTimer } = useTimer();
  const { toast } = useToast();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && startTime) {
      intervalId = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - startTime.getTime();
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, startTime]);

  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return `${days}日 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleTimerStart = async (isAbstinence: boolean) => {
    try {
      if (isAbstinence) {
        const now = new Date();
        setStartTime(now);
        setIsRunning(true);
        setElapsedTime(0);
      } else {
        setStartTime(null);
        setIsRunning(false);
        setElapsedTime(0);
      }

      await startTimer(isAbstinence);
      toast({
        title: isAbstinence ? "継続モード開始" : "失敗を記録",
        description: isAbstinence ? "タイマーを開始しました。頑張りましょう！" : "記録を保存しました。また頑張りましょう。",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "タイマーの開始に失敗しました",
      });
    }
  };

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
          onClick={() => handleTimerStart(true)}
          disabled={isRunning}
        >
          <ShieldCheck className="h-6 w-6 mr-2" />
          継続を開始
        </Button>

        <Button
          size="lg"
          variant="destructive"
          className="h-24"
          onClick={() => handleTimerStart(false)}
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          失敗を記録
        </Button>
      </div>
    </div>
  );
}
