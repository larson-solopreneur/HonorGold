import { Button } from "@/components/ui/button";
import { useTimer } from "../hooks/use-timer";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, AlertTriangle } from "lucide-react";

export function Timer() {
  const { startTimer } = useTimer();
  const { toast } = useToast();

  const handleTimerStart = async (isAbstinence: boolean) => {
    try {
      await startTimer(isAbstinence);
      toast({
        title: isAbstinence ? "Abstinence Mode Started" : "Failure Mode Started",
        description: "Your timer has been started successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start timer",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
        <Clock className="h-6 w-6" />
        Timer Controls
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-24"
          onClick={() => handleTimerStart(true)}
        >
          <ShieldCheck className="h-6 w-6 mr-2" />
          Start Abstinence
        </Button>

        <Button
          size="lg"
          variant="destructive"
          className="h-24"
          onClick={() => handleTimerStart(false)}
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          Record Failure
        </Button>
      </div>
    </div>
  );
}
