import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timerSessions = pgTable("timer_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  isAbstinence: boolean("is_abstinence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).extend({
  email: z.string().email({
    message: "メールアドレスの形式が正しくありません。",
  }),
  password: z.string().min(8, {
    message: "パスワードは8文字以上である必要があります。",
  }),
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertTimerSessionSchema = createInsertSchema(timerSessions);
export const selectTimerSessionSchema = createSelectSchema(timerSessions);
export type InsertTimerSession = z.infer<typeof insertTimerSessionSchema>;
export type TimerSession = z.infer<typeof selectTimerSessionSchema>;
