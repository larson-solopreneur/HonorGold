import { type Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { timerSessions } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Start a new timer session
  app.post("/api/timer/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
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
      res.status(500).send("Failed to start timer");
    }
  });

  // End current timer session
  app.post("/api/timer/end", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const [session] = await db
        .update(timerSessions)
        .set({ endTime: new Date() })
        .where(eq(timerSessions.userId, req.user.id))
        .returning();

      res.json(session);
    } catch (error) {
      res.status(500).send("Failed to end timer");
    }
  });

  // Get user's timer history
  app.get("/api/timer/history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const sessions = await db
        .select()
        .from(timerSessions)
        .where(eq(timerSessions.userId, req.user.id))
        .orderBy(timerSessions.startTime);

      res.json(sessions);
    } catch (error) {
      res.status(500).send("Failed to fetch timer history");
    }
  });
}
