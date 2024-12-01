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

## コントリビューション
プルリクエストは大歓迎です。大きな変更を加える場合は、まずissueを作成して変更内容を議論してください。
