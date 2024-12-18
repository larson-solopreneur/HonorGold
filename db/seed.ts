import 'dotenv/config';
import { db } from './index';
import { users, timerSessions } from './schema';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // ユーザーデータの作成
    const [user1] = await db.insert(users).values({
      email: 'test@example.com',
      password: 'dummyPass123',
      username: 'TestUser1',
      targetDays: 30
    }).returning();

    const [user2] = await db.insert(users).values({
      email: 'demo@example.com',
      password: 'dummyPass456',
      username: 'DemoUser',
      targetDays: 14
    }).returning();

    // タイマーセッションの作成
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    await db.insert(timerSessions).values([
      {
        userId: user1.id,
        startTime: twoDaysAgo,
        endTime: new Date(twoDaysAgo.getTime() + 8 * 60 * 60 * 1000),
        isAbstinence: true
      },
      {
        userId: user1.id,
        startTime: yesterday,
        endTime: new Date(yesterday.getTime() + 12 * 60 * 60 * 1000),
        isAbstinence: true
      },
      {
        userId: user1.id,
        startTime: now,
        endTime: null,
        isAbstinence: true
      },
      {
        userId: user2.id,
        startTime: yesterday,
        endTime: new Date(yesterday.getTime() + 4 * 60 * 60 * 1000),
        isAbstinence: false
      }
    ]);

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  }

  // シャットダウンハンドラが動作するまで少し待つ
  setTimeout(() => process.exit(0), 100);
}

main();