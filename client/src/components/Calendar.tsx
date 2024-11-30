import { useTimer } from "../hooks/use-timer";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addDays, isSameDay, isWithinInterval } from "date-fns";
import { ja } from 'date-fns/locale';

export function Calendar() {
  const { history } = useTimer();

  const today = new Date();
  
  const getDayState = (date: Date) => {
    if (!history) return null;
    
    for (const session of history) {
      const startTime = new Date(session.startTime);
      const endTime = session.endTime ? new Date(session.endTime) : today;
      
      if (isWithinInterval(date, { start: startTime, end: endTime })) {
        return session.isAbstinence ? "abstinence" : "failure";
      }
    }
    
    return null;
  };

  return (
    <Card className="mt-8">
      <CardHeader className="space-y-1">
        <CardTitle>進捗カレンダー</CardTitle>
        <CardDescription>あなたの継続記録を視覚的に確認できます</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4">
          <CalendarUI
            mode="single"
            selected={today}
            locale={ja}
            modifiers={{
              abstinence: (date) => getDayState(date) === "abstinence",
              failure: (date) => getDayState(date) === "failure",
            }}
            modifiersStyles={{
              abstinence: {
                color: "white",
                backgroundColor: "hsl(142.1 76.2% 36.3%)",
                fontWeight: "bold",
              },
              failure: {
                color: "white",
                backgroundColor: "hsl(0 84.2% 60.2%)",
                fontWeight: "bold",
              },
            }}
            className="rounded-md border shadow-sm"
            disabled={false}
          />
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(142.1,76.2%,36.3%)]"></div>
              <span>継続中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(0,84.2%,60.2%)]"></div>
              <span>失敗</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
