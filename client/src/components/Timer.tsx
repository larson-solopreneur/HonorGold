import { Button } from "@/components/ui/button";
import { useTimer } from "../hooks/use-timer";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export function Timer() {
  const { startTimer } = useTimer();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimerStart = async (isAbstinence: boolean) => {
    try {
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
        <p className="text-4xl font-mono">
          {currentTime.toLocaleTimeString('ja-JP')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-24"
          onClick={() => handleTimerStart(true)}
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
