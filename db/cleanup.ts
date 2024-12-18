import { db } from './index';
import { timerSessions, users } from './schema';

async function cleanup() {
  console.log('🧹 Cleaning up database...');

  try {
    // 外部キー制約があるため、先にtimerSessionsを削除
    await db.delete(timerSessions);
    await db.delete(users);
    
    console.log('✅ Cleanup completed!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }

  // シャットダウンハンドラが動作するまで少し待つ
  setTimeout(() => process.exit(0), 100);
}

cleanup();