# Rese 開発計画書 (改訂版)

## 1. 設計概念 (Core Concepts)

### アーキテクチャ
*   **完全分離構成:** フロントエンド (Next.js) と バックエンド (Laravel API) を疎結合にする。
*   **ステートフル認証:** SPA認証には **Laravel Sanctum (手動設定)** と **NextAuth.js** を採用する。

### 開発方針
*   **機能優先 (Function First):** UIの装飾よりも、データの正確な流れと機能の実装を最優先する。
*   **画面逆算設計 (UI-Driven API):** APIのエンドポイントやレスポンス構造は、画面に必要なデータから逆算して決定する。
*   **堅牢性:** データベースレベルでの制約（複合ユニークキー等）を活用し、データの整合性を担保する。

---

## 2. 重要事項 (Critical Points)

### データベース
*   **複合ユニーク制約:** `reservations` テーブルの `(user_id, start_at)` および `favorites` テーブルの `(user_id, shop_id)` には必ず設定する。
*   **論理削除:** 予約キャンセルは `deleted_at` (SoftDeletes) を使用し、履歴を残す。

### バリデーション
*   **重複予約防止:** DBのユニーク制約に加え、FormRequestクラスで「時間の重複（開始〜終了時間が被る予約）」をチェックするロジックを実装する。

### 非同期処理
*   **リアルタイム性:** 検索フォーム、お気に入り登録、予約空席確認は、画面遷移を伴わない非同期通信 (**SWR** / Axios) で実装する。

### プロセス記録
*   **開発ログの義務化:** 機能実装や大きな変更が完了し、Gitリポジトリへプッシュする際には、必ず `docs-private/DEV_LOG.md` にそこまでの開発プロセス、技術的判断、実行したコマンド等を記録する。これは学習の記録であると同時に、開発コンテキストの復旧にも役立てる。
*   **復旧マニュアルの同期:** `DEV_LOG.md` の更新と合わせて、`AGENT_RECOVERY_MANUAL.md` の内容（特に分析対象のファイルリストや結論）が現状と一致しているかを確認し、必要に応じて更新する。

---

## 3. ロードマップ (Roadmap)

### Phase 1: 基盤構築と設計（完了済）
*   プロジェクト作成 (Laravel + Next.js)
*   データベース設計・機能要件定義
*   Gitリポジトリ初期化

### Phase 2: データベースとモデル定義（完了済）
*   マイグレーションファイルの作成・実行
*   モデル・リレーション定義
*   初期データ投入 (Seeder)

### Phase 3: 店舗機能APIの実装
*   `ShopController` 作成 (`index`, `show` メソッド)
*   `GET /api/shops` 実装 (エリア、ジャンル、キーワード検索対応)
*   `GET /api/shops/{id}` 実装

### Phase 4: 認証機能の実装
*   **バックエンド (Laravel):**
    *   `laravel/sanctum` のインストールと設定。
    *   `app/Http/Kernel.php` に `EnsureFrontendRequestsAreStateful` ミドルウェアを追加。
    *   `.env` ファイルに `SANCTUM_STATEFUL_DOMAINS` 等の環境変数を設定。
    *   `routes/web.php` に `/login`, `/logout` ルートとロジックを実装。
    *   `routes/api.php` に `/user` ルートを実装。
*   **フロントエンド (Next.js):**
    *   `next-auth` パッケージのインストール。
    *   `app/api/auth/[...nextauth]/route.ts` に `CredentialsProvider` を実装し、Laravelの認証APIと連携させる。
    *   `SessionProvider` (Context) を `app/layout.tsx` に設定。
    *   ログインページ (`/login`)、登録ページ (`/register`) のUIとロジックを実装。

### Phase 5: フロントエンドの実装 (店舗・予約・お気に入り)
*   **店舗:**
    *   店舗一覧ページ (`/` または `/shops`) を実装 (`SWR` を利用)。
    *   検索フィルターコンポーネントを実装。
    *   店舗詳細ページ (`/shops/{id}`) を実装。
*   **予約・お気に入り (要ログイン):**
    *   お気に入り登録/解除API (`FavoriteController`) の実装と、フロントエンドからの非同期通信。
    *   予約空席チェックAPIと予約実行API (`ReservationController`) の実装。
    *   予約フォームコンポーネントの実装。
    *   マイページ (`/mypage`) 実装 (予約一覧・キャンセル・お気に入り一覧)。

### Phase 6: 仕上げと拡張
*   予約リマインダーメール (バッチ処理)
*   README整備、デプロイ準備

---

## 4. フロントエンド実装ガイドライン (Tailwind CSS)

### 基本方針
*   **モバイルファースト (Mobile First):**
    *   基本スタイルはスマホ（最小画面）向けに記述する。
    *   PC向けのスタイルは `md:`, `lg:` などのプレフィックスを用いて上書きする。

### スタイリングルール
*   **ユーティリティファースト:**
    *   CSSファイルへの記述は避け、JSX内の `className` に直接記述する。
    *   `@apply` の使用は原則禁止し、再利用が必要な場合は **Reactコンポーネント化** で対応する。
*   **自動整形:**
    *   `prettier-plugin-tailwindcss` を導入し、クラス名の並び順を自動で統一する。
