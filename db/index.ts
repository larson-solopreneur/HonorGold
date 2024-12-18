import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// PostgreSQLクライアントの設定
const connectionOptions = {
  max: 10, // 最大接続数
  idle_timeout: 20, // アイドル接続のタイムアウト（秒）
  connect_timeout: 10, // 接続タイムアウト（秒）
  types: {
    date: {
      to: 1184,  // timestamptz型に対応
      from: [1082, 1114, 1184],  // date, timestamp, timestamptz型をサポート
      serialize: (v: Date) => v,
      parse: (v: string) => new Date(v)
    }
  }
};

// シングルトンパターンでクライアントを管理
class DatabaseClient {
  private static instance: postgres.Sql | null = null;
  private static drizzleInstance: ReturnType<typeof drizzle> | null = null;

  public static getInstance(): ReturnType<typeof drizzle> {
    if (!this.drizzleInstance) {
      // クライアントの初期化
      this.instance = postgres(process.env.DATABASE_URL!, connectionOptions);
      this.drizzleInstance = drizzle(this.instance, { schema });

      // プロセス終了時のクリーンアップ
      process.on('SIGINT', () => this.cleanup());
      process.on('SIGTERM', () => this.cleanup());
      process.on('exit', () => this.cleanup());
    }
    return this.drizzleInstance;
  }

  private static async cleanup() {
    if (this.instance) {
      console.log('Closing database connections...');
      await this.instance.end();
      this.instance = null;
      this.drizzleInstance = null;
      console.log('Database connections closed.');
    }
  }
}

// データベースクライアントのエクスポート
export const db = DatabaseClient.getInstance();