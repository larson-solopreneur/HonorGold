import React from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addDays, isSameDay, isWithinInterval } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface TimerSession {
  id: number;
  userId: number;
  startTime: string;
  endTime: string | null;
  isAbstinence: boolean;
}

interface CalendarProps {
  sessions: TimerSession[];
  className?: string;
}

export function Calendar({ sessions, className }: CalendarProps) {
  const { t, language } = useLanguage();
  const today = new Date();

  const getDayStatus = (date: Date) => {
    const session = sessions.find((s) => {
      const startTime = new Date(s.startTime);
      const endTime = s.endTime ? new Date(s.endTime) : null;

      return endTime
        ? isWithinInterval(date, { start: startTime, end: endTime })
        : isSameDay(date, startTime);
    });

    return session?.isAbstinence;
  };

  const modifiers = {
    success: (date: Date) => getDayStatus(date) === true,
    failure: (date: Date) => getDayStatus(date) === false,
  };

  const modifiersStyles = {
    success: {
      backgroundColor: "#16a34a",
      color: "white",
    },
    failure: {
      backgroundColor: "#dc2626",
      color: "white",
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('calendar.title')}</CardTitle>
        <CardDescription>{t('calendar.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <CalendarUI
          mode="single"
          selected={today}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border shadow"
          locale={language === 'ja' ? 'ja' : 'en'}
          fromDate={addDays(today, -30)}
          toDate={today}
        />
      </CardContent>
    </Card>
  );
}