import { useTimer } from "../hooks/use-timer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export function Statistics() {
  const { history } = useTimer();

  const getMonthlyStats = () => {
    if (!history) return [];

    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });

    const stats = days.map((date) => {
      const dayStr = format(date, "MMM dd");
      let abstinence = 0;
      let failure = 0;

      history.forEach((session) => {
        const sessionStart = new Date(session.startTime);
        const sessionEnd = session.endTime
          ? new Date(session.endTime)
          : new Date();

        if (
          date >= sessionStart &&
          date <= sessionEnd
        ) {
          if (session.isAbstinence) {
            abstinence++;
          } else {
            failure++;
          }
        }
      });

      return {
        date: dayStr,
        abstinence,
        failure,
      };
    });

    return stats;
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Monthly Statistics</CardTitle>
        <CardDescription>
          Your progress throughout the current month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getMonthlyStats()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="abstinence" fill="hsl(142.1 76.2% 36.3%)" name="Abstinence" />
            <Bar dataKey="failure" fill="hsl(0 84.2% 60.2%)" name="Failure" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
