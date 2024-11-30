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
    <Card>
      <CardHeader>
        <CardTitle>Progress Calendar</CardTitle>
        <CardDescription>Track your journey visually</CardDescription>
      </CardHeader>
      <CardContent>
        <CalendarUI
          mode="single"
          selected={today}
          modifiers={{
            abstinence: (date) => getDayState(date) === "abstinence",
            failure: (date) => getDayState(date) === "failure",
          }}
          modifiersStyles={{
            abstinence: {
              color: "white",
              backgroundColor: "hsl(142.1 76.2% 36.3%)",
            },
            failure: {
              color: "white",
              backgroundColor: "hsl(0 84.2% 60.2%)",
            },
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
