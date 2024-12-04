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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ja } from 'date-fns/locale';
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart2, LineChart as LineChartIcon, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

type ChartType = "bar" | "line" | "calendar";

export function Statistics() {
  const { history } = useTimer();
  const [chartType, setChartType] = useState<ChartType>("bar");

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

  const getDayState = (date: Date) => {
    if (!history) return null;
    
    for (const session of history) {
      const startTime = new Date(session.startTime);
      const endTime = session.endTime ? new Date(session.endTime) : new Date();
      
      if (date >= startTime && date <= endTime) {
        return session.isAbstinence ? "abstinence" : "failure";
      }
    }
    
    return null;
  };

  const renderChart = () => {
    const data = getMonthlyStats();
    
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="abstinence" fill="hsl(142.1 76.2% 36.3%)" name="継続" />
              <Bar dataKey="failure" fill="hsl(0 84.2% 60.2%)" name="失敗" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="abstinence" stroke="hsl(142.1 76.2% 36.3%)" name="継続" />
              <Line type="monotone" dataKey="failure" stroke="hsl(0 84.2% 60.2%)" name="失敗" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "calendar":
        return (
          <div className="p-4">
            <CalendarUI
              mode="single"
              selected={new Date()}
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
        );
    }
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>月間統計</CardTitle>
        <CardDescription>
          今月の進捗状況
        </CardDescription>
        <div className="flex justify-center pt-2">
          <ToggleGroup type="single" value={chartType} onValueChange={(value: ChartType) => value && setChartType(value)}>
            <ToggleGroupItem value="bar" aria-label="棒グラフ表示" title="棒グラフで表示">
              <BarChart2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="line" aria-label="折れ線グラフ表示" title="折れ線グラフで表示">
              <LineChartIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="カレンダー表示" title="カレンダーで表示">
              <CalendarIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-140px)]">
        <div className="h-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}
