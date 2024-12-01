# Honor Gold - 自己制御管理アプリケーション

## 概要
Honor Goldは、自己制御とタイムトラッキングを支援するWebアプリケーションです。ユーザーは継続時間を記録し、進捗状況をカレンダーと統計で視覚的に確認できます。

## 主な機能
- 🔐 ユーザー認証システム（登録/ログイン）
- ⏱️ タイマー機能
  - 継続時間のトラッキング
  - 失敗記録の管理
- 📅 カレンダー表示
  - 日々の進捗状況の可視化
  - 継続/失敗の色分け表示
- 📊 月間統計
  - グラフによる進捗分析
  - 継続と失敗の比較

## 技術スタック
### フロントエンド
- React
- TypeScript
- TanStack Query
- Shadcn/UI
- Tailwind CSS
- Date-fns
- Recharts

### バックエンド
- Express
- PostgreSQL
- Drizzle ORM
- Passport.js

## セットアップ方法

### 前提条件
- Node.js 20.x
- PostgreSQL 16.x

### インストール手順
1. リポジトリのクローン:
```bash
git clone https://github.com/larson-solopreneur/honorgold.git
cd honorgold
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
`.env`ファイルを作成し、以下の変数を設定:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

4. データベースのセットアップ:
```bash
npm run db:push
```

5. アプリケーションの起動:
```bash
npm run dev
```

## API エンドポイント

### 認証関連
- `POST /api/register` - ユーザー登録
- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト
- `GET /api/user` - ユーザー情報の取得

### タイマー関連
- `POST /api/timer/start` - タイマーの開始
- `POST /api/timer/end` - タイマーの終了
- `GET /api/timer/history` - タイマー履歴の取得

## 使用方法

### アカウント作成とログイン
1. トップページの「新規登録」をクリック
2. メールアドレスとパスワードを入力
3. アカウント作成後、自動的にログイン

### タイマーの使用
1. ホーム画面の「継続を開始」ボタンをクリック
2. タイマーが開始され、経過時間が表示
3. 失敗した場合は「失敗を記録」ボタンをクリック

### 進捗の確認
- カレンダー: 日々の記録を色分けで表示
  - 緑: 継続中
  - 赤: 失敗
- 月間統計: グラフで月間の進捗を分析

## 開発環境

### 使用可能なスクリプト
- `npm run dev` - 開発サーバーの起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーの起動
- `npm run check` - TypeScriptの型チェック
- `npm run db:push` - データベーススキーマの更新

### デプロイメント
このプロジェクトはReplitを使用してデプロイされています。Replitのワークフローにより、自動的にビルドとデプロイが行われます。

## ライセンス
MIT

## トラブルシューティング

### データベース接続エラー
**エラー内容**:
```
Error: DATABASE_URL must be set. Did you forget to provision a database?
```
**解決方法**:
1. .envファイルが正しく配置されているか確認
2. DATABASE_URLの形式を確認:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/honorgold
   ```
3. PostgreSQLサービスが起動しているか確認

### 環境変数読み込みエラー
**エラー内容**:
```
Error: Cannot find module 'dotenv'
```
**解決方法**:
1. dotenvパッケージのインストール:
   ```bash
   npm install dotenv
   ```
2. server/index.tsの先頭に以下を追加:
   ```typescript
   import 'dotenv/config';
   ```

### データベースマイグレーションエラー
**エラー内容**:
```
Error: connect ECONNREFUSED ::1:5432
```
**解決方法**:
1. PostgreSQLサービスの起動確認
2. データベースの作成:
   ```sql
   CREATE DATABASE honorgold;
   ```
3. マイグレーションの実行:
   ```bash
   npm run db:push
   ```

### ポート競合エラー
**エラー内容**:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**解決方法**:
1. 使用中のポートを確認:
   ```bash
   lsof -i :5000
   ```
2. 競合するプロセスの終了
3. 別のポートを使用（環境変数PORTで設定可能）

### Node.jsバージョン互換性エラー
**エラー内容**:
```
Error: The engine "node" is incompatible with this module
```
**解決方法**:
1. Node.jsバージョンの確認:
   ```bash
   node --version
   ```
2. Node.js 20.xへのアップグレード:
   ```bash
   nvm install 20
   nvm use 20
   ```

注意: これらの解決方法を試しても問題が解決しない場合は、issueを作成してください。

## コントリビューション
プルリクエストは大歓迎です。大きな変更を加える場合は、まずissueを作成して変更内容を議論してください。
