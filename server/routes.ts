import { Router, Express } from "express";
import { db } from "../db";
import { timerSessions } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

// タイマーセッションの開始
router.post("/start", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "認証が必要です" });
  }

  const { isAbstinence } = req.body;
  
  try {
    const [session] = await db.insert(timerSessions)
      .values({
        userId,
        startTime: new Date(),
        isAbstinence
      })
      .returning();

    res.json(session);
  } catch (error) {
    console.error("Error starting timer:", error);
    res.status(500).json({ error: "タイマーの開始に失敗しました" });
  }
});

// アクティブなタイマーセッションの終了
router.post("/end", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "認証が必要です" });
  }

  try {
    const [activeSession] = await db
      .select()
      .from(timerSessions)
      .where(
        and(
          eq(timerSessions.userId, userId),
          sql`${timerSessions.endTime} IS NULL`
        )
      )
      .limit(1);

    if (!activeSession) {
      return res.status(404).json({ error: "アクティブなセッションが見つかりません" });
    }

    const [updatedSession] = await db
      .update(timerSessions)
      .set({ endTime: new Date() })
      .where(eq(timerSessions.id, activeSession.id))
      .returning();

    res.json(updatedSession);
  } catch (error) {
    console.error("Error ending timer:", error);
    res.status(500).json({ error: "タイマーの終了に失敗しました" });
  }
});

// アクティブなタイマーセッションの取得
router.get("/active", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "認証が必要です" });
  }

  try {
    const [activeSession] = await db
      .select()
      .from(timerSessions)
      .where(
        and(
          eq(timerSessions.userId, userId),
          sql`${timerSessions.endTime} IS NULL`
        )
      )
      .limit(1);

    if (!activeSession) {
      return res.json(null);
    }

    res.json(activeSession);
  } catch (error) {
    console.error("Error fetching active timer:", error);
    res.status(500).json({ error: "アクティブなタイマーの取得に失敗しました" });
  }
});

// タイマーセッション履歴の取得
router.get("/history", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "認証が必要です" });
  }

  try {
    const history = await db
      .select()
      .from(timerSessions)
      .where(eq(timerSessions.userId, userId))
      .orderBy(desc(timerSessions.startTime))
      .limit(100);

    res.json(history);
  } catch (error) {
    console.error("Error fetching timer history:", error);
    res.status(500).json({ error: "タイマー履歴の取得に失敗しました" });
  }
});

export const registerRoutes = (app: Express) => {
  app.use('/api/timer', router);
};

export default router;