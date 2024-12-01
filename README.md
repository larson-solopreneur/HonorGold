# Honor Gold - 自己制御管理アプリケーション

## 概要
Honor Goldは、自己制御とタイムトラッキングを支援するWebアプリケーションです。ユーザーは継続時間を記録し、進捗状況をカレンダーと統計で視覚的に確認できます。

## 主な機能
- 🔐 ユーザー認証システム（登録/ログイン）
- ⏱️ タイマー機能
  - 継続時間のトラッキング（X日 HH:MM:SS形式）
  - 失敗記録の管理
- 📅 カレンダー表示
  - 日々の進捗状況の可視化
  - 継続/失敗の色分け表示
- 📊 月間統計
  - グラフによる進捗分析
  - 継続と失敗の比較
- 🌓 ダークモードUI

## 技術スタック
### フロントエンド
- React + TypeScript
- TanStack Query（データフェッチング）
- Shadcn/UI（UIコンポーネント）
- Tailwind CSS（スタイリング）
- Date-fns（日付処理）
- Recharts（グラフ描画）
- Wouter（ルーティング）

### バックエンド
- Express（APIサーバー）
- PostgreSQL（データベース）
- Drizzle ORM（ORMツール）
- Passport.js（認証）

## セットアップ方法

### 前提条件
- Node.js 20.x以上
- PostgreSQL 16.x
- npm 10.x以上

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
アプリケーションは`http://localhost:5012`で起動します。

### 開発環境での注意点
- デフォルトポート: 5012 (`.replit`で設定)
- 本番環境では自動的にポート80にマッピング
- WebSocketsによるホットリロード対応
- TypeScriptの型チェックが自動実行

## API エンドポイント

### 認証関連
- `POST /api/register` - ユーザー登録
  - リクエスト: `{ email: string, password: string }`
  - レスポンス: `{ message: string, user: { id: number, email: string } }`

- `POST /api/login` - ログイン
  - リクエスト: `{ email: string, password: string }`
  - レスポンス: `{ message: string, user: { id: number, email: string } }`

- `POST /api/logout` - ログアウト
  - レスポンス: `{ message: string }`

- `GET /api/user` - ユーザー情報の取得
  - レスポンス: `{ id: number, email: string, createdAt: string }`

### タイマー関連
- `POST /api/timer/start` - タイマーの開始
  - リクエスト: `{ isAbstinence: boolean }`
  - レスポンス: `TimerSession`

- `POST /api/timer/end` - タイマーの終了
  - レスポンス: `TimerSession`

- `GET /api/timer/history` - タイマー履歴の取得
  - レスポンス: `TimerSession[]`

## 使用方法

### アカウント作成とログイン
1. トップページの「新規登録」をクリック
2. メールアドレスとパスワード（8文字以上）を入力
3. アカウント作成後、自動的にログイン

### タイマーの使用
1. ホーム画面の「継続を開始」ボタンをクリック
2. タイマーが開始され、経過時間が「X日 HH:MM:SS」形式で表示
3. 失敗した場合は「失敗を記録」ボタンをクリック

### 進捗の確認
- カレンダー: 日々の記録を色分けで表示
  - 緑: 継続中
  - 赤: 失敗
- 月間統計: グラフで月間の進捗を分析
  - 継続日数の推移
  - 失敗回数の集計

## 開発環境

### 使用可能なスクリプト
- `npm run dev` - 開発サーバーの起動（ポート5012）
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーの起動
- `npm run check` - TypeScriptの型チェック
- `npm run db:push` - データベーススキーマの更新

### デプロイメント
このプロジェクトはReplitを使用してデプロイされています：

1. Replitでの自動デプロイ設定：
```toml
[deployment]
deploymentTarget = "cloudrun"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
```

2. 環境変数の設定：
- Replitのシークレット機能を使用
- 必要な環境変数：`DATABASE_URL`

## トラブルシューティング

### データベース接続エラー
**エラー内容**:
```
Error: DATABASE_URL must be set. Did you forget to provision a database?
```
**解決方法**:
1. .envファイルの確認
2. DATABASE_URLの形式を確認:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/honorgold
   ```
3. PostgreSQLサービスの起動確認

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
2. server/index.tsの確認

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
Error: listen EADDRINUSE: address already in use :::5012
```
**解決方法**:
1. 使用中のポートを確認:
   ```bash
   lsof -i :5012
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

## セキュリティ
### 認証とセッション管理
- パスワードハッシュ化（scrypt）
  - ソルト付きハッシュ
  - メモリコスト: 64バイト
  - 独立したソルト生成
- セッション保護
  - express-sessionによる管理
  - メモリストアによるセッション保存
  - 7日間の有効期限設定
- Cookie セキュリティ
  - SameSite=Lax設定でCSRF対策
  - 本番環境ではSecure属性有効
  - HttpOnly属性によるXSS対策
- APIセキュリティ
  - 認証済みエンドポイントの厳密な保護
  - エラーメッセージの適切な抽象化
  - レート制限の実装（近日実装予定）

## パフォーマンス最適化

### フロントエンド最適化
- React Query によるデータ管理
  - クエリキャッシュの有効活用
  - 自動的な再検証
  - エラー処理の一元管理
- コンポーネントの最適化
  - メモ化による不要な再レンダリング防止
  - 遅延ロードの実装
  - Suspenseによる読み込み状態の管理

### バックエンド最適化
- データベース最適化
  - user_idに対するインデックス作成
  - クエリのN+1問題の回避
  - 効率的なJOIN操作の実装
- API応答の最適化
  - 適切なデータ量の制御
  - レスポンスの圧縮
  - キャッシュヘッダーの設定

### 開発環境の最適化
- Viteによる高速な開発サーバー
- TypeScriptの型チェック最適化
- HMRによる即時更新

## コントリビューション
1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。

## サポート
不具合や提案がある場合は、GitHubのIssueを作成してください。
