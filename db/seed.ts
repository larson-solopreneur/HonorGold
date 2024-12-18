import 'dotenv/config';
import { db } from './index';
import { users, timerSessions } from './schema';
import { authUtils } from '../server/utils/auth';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // ユーザーデータの作成を試みる前にユーザーテーブルの状態を確認
    const existingUsers = await db.select().from(users);
    console.log('Existing users before seeding:', existingUsers);

    // パスワードのハッシュ化
    const hashedPassword1 = await authUtils.hash('dummyPass123');
    const hashedPassword2 = await authUtils.hash('dummyPass456');

    // ユーザーデータの作成
    console.log('Creating user1...');
    const [user1] = await db.insert(users).values({
      email: 'test@example.com',
      password: hashedPassword1,
      username: 'TestUser1',
      targetDays: 30
    }).returning();
    console.log('Created user1:', user1);

    console.log('Creating user2...');
    const [user2] = await db.insert(users).values({
      email: 'demo@example.com',
      password: hashedPassword2,
      username: 'DemoUser',
      targetDays: 14
    }).returning();
    console.log('Created user2:', user2);

    // タイマーセッションの作成
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    console.log('Creating timer sessions...');
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

    // 最終確認
    const finalUsers = await db.select().from(users);
    console.log('Final users after seeding:', finalUsers);

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