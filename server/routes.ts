import { type Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { timerSessions } from "@db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Start a new timer session
  app.post("/api/timer/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("認証されていません");
    }

    const { isAbstinence } = req.body;
    
    try {
      const [session] = await db
        .insert(timerSessions)
        .values({
          userId: req.user.id,
          startTime: new Date(),
          isAbstinence,
        })
        .returning();

      res.json(session);
    } catch (error) {
      console.error("タイマー開始エラー:", req.user.id, error);
      res.status(500).send("タイマーの開始に失敗しました");
    }
  });

  // End current timer session
  app.post("/api/timer/end", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("認証されていません");
    }

    try {
      const [session] = await db
        .update(timerSessions)
        .set({ endTime: new Date() })
        .where(
          and(
            eq(timerSessions.userId, req.user.id),
            isNull(timerSessions.endTime)
          )
        )
        .returning();

      if (!session) {
        return res.status(404).send("アクティブなセッションが見つかりません");
      }

      res.json(session);
    } catch (error) {
      console.error("タイマー終了エラー:", req.user.id, error);
      res.status(500).send("タイマーの終了に失敗しました");
    }
  });

  // Get user's timer history
  app.get("/api/timer/history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("認証されていません");
    }

    try {
      const sessions = await db
        .select()
        .from(timerSessions)
        .where(eq(timerSessions.userId, req.user.id))
        .orderBy(desc(timerSessions.startTime));

      res.json(sessions);
    } catch (error) {
      console.error("履歴取得エラー:", req.user.id, error);
      res.status(500).send("タイマー履歴の取得に失敗しました");
    }
  });

  // Get active timer session
  app.get("/api/timer/active", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("認証されていません");
    }

    try {
      const [activeSession] = await db
        .select()
        .from(timerSessions)
        .where(
          and(
            eq(timerSessions.userId, req.user.id),
            isNull(timerSessions.endTime)
          )
        )
        .orderBy(desc(timerSessions.startTime))
        .limit(1);

      res.json(activeSession || null);
    } catch (error) {
      console.error("アクティブセッション取得エラー:", req.user.id, error);
      res.status(500).send("アクティブなタイマーの取得に失敗しました");
    }
  });
}
