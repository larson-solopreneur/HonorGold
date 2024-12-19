import { Button } from "@/components/ui/button";
import { useTimer } from "../hooks/use-timer";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export function Timer() {
  const { startTimer, endTimer, activeSession } = useTimer();
  const { toast } = useToast();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [lastStartTime, setLastStartTime] = useState<string | null>(null);
  const [lastFailureTime, setLastFailureTime] = useState<string | null>(null);

  useEffect(() => {
    // ローカルストレージから最終アクション時間を取得
    setLastStartTime(localStorage.getItem('lastStartTime'));
    setLastFailureTime(localStorage.getItem('lastFailureTime'));
  }, []);

  // タイマー更新のための useEffect
  useEffect(() => {
    let intervalId: number;

    if (activeSession?.startTime && !activeSession?.endTime) {
      intervalId = window.setInterval(() => {
        const start = new Date(activeSession.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(now - start);
      }, 1000);

      // 初期値を設定
      const start = new Date(activeSession.startTime).getTime();
      const now = new Date().getTime();
      setElapsedTime(now - start);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [activeSession]);

  const isButtonDisabled = (lastActionTime: string | null, buttonType: 'start' | 'failure') => {
    // 失敗ボタンの場合は、継続中の時のみ押せるようにする
    if (buttonType === 'failure') {
      return status !== "継続中";
    }

    // 開始ボタンの場合は従来の時間チェックを行う
    if (!lastActionTime) return false;

    const lastAction = new Date(lastActionTime);
    const now = new Date();
    const tomorrow4am = new Date(lastAction);
    tomorrow4am.setDate(tomorrow4am.getDate() + 1);
    tomorrow4am.setHours(4, 0, 0, 0);

    return now < tomorrow4am;
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
      const now = new Date().toISOString();
      localStorage.setItem('lastStartTime', now);
      setLastStartTime(now);
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
      if (activeSession?.startTime && !activeSession?.endTime) {
        await endTimer();
        const now = new Date().toISOString();
        localStorage.setItem('lastFailureTime', now);
        setLastFailureTime(now);
        // 継続開始時間もクリア
        localStorage.removeItem('lastStartTime');
        setLastStartTime(null);
        toast({
          title: "失敗を記録",
          description: "記録を保存しました。また頑張りましょう。",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "失敗の記録に失敗しました",
      });
    }
  };

  const getStatus = () => {
    if (activeSession?.startTime && !activeSession?.endTime) {
      return "継続中";
    }
    if (lastFailureTime && new Date(lastFailureTime).toDateString() === new Date().toDateString()) {
      return "失敗";
    }
    return "未開始";
  };

  const status = getStatus();

  // デバッグ用のuseEffect
  useEffect(() => {
    console.log({
      status,
      lastFailureTime,
      isDisabled: isButtonDisabled(lastFailureTime, 'failure'),
      activeSession
    });
  }, [status, lastFailureTime, activeSession]);

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
        <p className="text-lg font-semibold">
          ステータス: {status}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-24"
          onClick={handleStart}
          disabled={isButtonDisabled(lastStartTime, 'start') || status === "継続中"}
        >
          <ShieldCheck className="h-6 w-6 mr-2" />
          継続を開始
        </Button>

        <Button
          size="lg"
          variant="destructive"
          className="h-24"
          onClick={handleFailure}
          disabled={isButtonDisabled(lastFailureTime, 'failure')}
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          失敗を記録
        </Button>
      </div>
    </div>
  );
}
