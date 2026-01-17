# Rese 開発ログ (Development Log)

## 概要
このドキュメントは、「Rese（飲食店予約サービス）」の開発プロセス、技術的決定事項、および学習の軌跡を記録するものです。

---

## 2026-01-13: プロジェクト開始と初期設計

### 1. プロジェクトの目的と方針
*   **目的:** LaravelとNext.jsを用いた実践的なWebアプリケーション開発を通じて、モダンな開発フローを学習する。
*   **基本方針:**
    *   **フロントエンド(FE)とバックエンド(BE)の完全分離:** 疎結合なアーキテクチャを採用。
    *   **機能優先:** UIの装飾よりも、データの流れと機能の実装を最優先する。
    *   **画面逆算設計:** APIの仕様は、画面に必要なデータから逆算して決定する。

### 2. 環境構築
*   **ディレクトリ構成:**
    *   `laravel-next-app`: バックエンド (Laravel 12 + Sail)
    *   `next-frontend-app`: フロントエンド (Next.js App Router + Tailwind CSS)
    *   これらを `lara-next-reserve` ルートディレクトリ直下に並列配置（モノレポ構成）。
*   **構築手順:**
    1.  `curl` コマンドで Laravel Sail プロジェクトを作成。
    2.  `create-next-app` で Next.js プロジェクトを作成（TypeScript, ESLint, Tailwind 採用）。
    3.  `.git` フォルダを整理し、ルートディレクトリで一括管理するよう初期化。

### 3. 設計プロセス（要件定義〜DB設計）
*   **要件の洗い出し:**
    *   Googleスプレッドシート（要件定義書）の分析。
    *   コーチ要件（電話番号追加、予約制限など）の統合。
    *   UI画像（`yoyaku_ui`）の分析による、予約キャンセル機能やお気に入り機能の具体化。
*   **データベース設計の決定事項:**
    *   **Users:** 電話番号、性別、年齢カラムを追加。
    *   **Shops:** 予約制御用カラム（開始・終了時間、収容人数）を追加。
    *   **Reservations:**
        *   キャンセル機能のため、論理削除（`deleted_at`）を採用。
        *   **複合ユニーク制約:** `(user_id, date, time)` で同一ユーザーの同時間帯の重複登録を物理的に防止。
    *   **Favorites:** 中間テーブルを作成し、`(user_id, shop_id)` に複合ユニーク制約を設定。

---

## 次のステップ
*   マイグレーションファイルの作成とデータベース構築。
*   モデル・リレーションの実装。

---

## 2026-01-16: Phase 2「データベースとモデル定義」完了

### 1. 完了したタスク
*   **マイグレーションファイルの作成とデータベース構築:**
    *   すべての計画されたテーブル（`users`, `shops`, `areas`, `genres`, `reservation_slots`, `reservations`, `favorites`）に対応するマイグレーションファイルが作成されました。
    *   `sail artisan migrate` によりデータベースが構築され、スキーマが適用済みです。
*   **モデル・リレーションの実装:**
    *   すべてのテーブルに対応するEloquentモデル（`User`, `Shop`, `Reservation`など）が作成されました。
    *   各モデルにおいて、設計書に基づいたリレーション（`hasMany`, `belongsTo`など）が適切に定義されています。

### 2. 特記事項
*   **複合ユニーク制約の確認:**
    *   `reservations`テーブルの `(user_id, start_at)` および `favorites`テーブルの `(user_id, shop_id)` において、複合ユニーク制約がマイグレーションファイルに正しく実装されていることを確認しました。これにより、データベースレベルでの重複登録が防止されます。
*   **論理削除 (SoftDeletes):**
    *   `reservations`テーブルにおいて、予約キャンセル機能のために `SoftDeletes` が適切に導入されていることを確認しました。
*   **拡張カラムの確認:**
    *   `users`テーブルの `phone_number`, `gender`, `birthday` や `shops`テーブルの `start_time`, `end_time`, `default_capacity`, `default_stay_time` といった追加要件のフィールドがモデルの`$fillable`属性に含まれており、適切に扱われる準備ができています。

### 3. 次のステップ
*   開発計画書「DEVELOPMENT_PLAN_revised.md」に基づき、Phase 3「店舗機能APIの実装」を開始します。

---

## 2026-01-16: Phase 3「店舗機能APIの実装」完了

### 1. 完了したタスク
*   **`ShopController` の実装:**
    *   `index` メソッド（店舗一覧取得・検索フィルタ対応）および `show` メソッド（店舗詳細取得）が、開発計画の要件通りに実装されました。Eager Loadingやルートモデルバインディングなど、Laravelのベストプラクティスが適用されています。
*   **APIルートの定義:**
    *   `routes/api.php` に `GET /api/shops` および `GET /api/shops/{shop}` ルートが正しく定義され、`ShopController` の各メソッドに紐付けられました。

### 2. 特記事項
*   **認証APIの部分実装:**
    *   Phase 4のタスクである `/api/user` ルートが `routes/api.php` にすでに定義されていることを確認しました。これにより、認証バックエンドの一部も実装済みです。

### 3. 次のステップ
*   開発計画書「DEVELOPMENT_PLAN_revised.md」に基づき、Phase 4「認証機能の実装」のバックエンド側のタスクを確認します。`routes/web.php` におけるログイン・ログアウトのルート定義はすでに実装済みであることを確認しました。

---

## 2026-01-16: Phase 4「認証機能の実装」の `routes/web.php` 側のタスク完了

### 1. 完了したタスク
*   `routes/web.php` におけるログイン・ログアウトのルート定義を確認しました。これらはすでに実装済みです。

### 2. 次のステップ
*   開発計画書「DEVELOPMENT_PLAN_revised.md」に基づき、Phase 4「認証機能の実装」の残りのタスク、具体的にはフロントエンド側の認証フローの実装に進みます。

---

## 2026-01-16: Phase 4「認証機能の実装」フロントエンド側の基本設定完了

### 1. 完了したタスク

#### バックエンド (Laravel)
*   **Sanctum SPA認証の有効化:**
    *   Laravel 11の仕様に合わせ、`bootstrap/app.php` に `EnsureFrontendRequestsAreStateful` ミドルウェアを登録しました。
    *   `.env` ファイルに `SANCTUM_STATEFUL_DOMAINS=localhost:3000` を設定し、フロントエンドからのステートフルなリクエストを許可しました。

#### フロントエンド (Next.js)
*   **`next-auth` の導入:**
    *   `next-auth` パッケージをインストールしました。
    *   `app/api/auth/[...nextauth]/route.ts` を作成し、Laravelバックエンドと連携する `CredentialsProvider` を実装しました。
    *   `types/next-auth.d.ts` を作成し、`Session` や `User` の型に `id` を追加する型拡張を行いました。
*   **`SessionProvider` の設定:**
    *   `app/providers.tsx` を作成し、`app/layout.tsx` でアプリケーション全体をラップすることで、セッション情報をグローバルに利用できるようにしました。
*   **環境変数の設定:**
    *   `.env.local` ファイルを作成し、バックエンドのURL (`BACKEND_URL`) と `next-auth` のシークレット (`NEXTAUTH_SECRET`) を設定しました。
*   **ログイン・登録ページの作成:**
    *   `/login` と `/register` のルートに、それぞれの機能を持つページコンポーネント (`page.tsx`) を作成しました。
    *   `機能一覧.csv` の要件に基づき、登録フォームに必要な入力項目（名前、電話番号、性別、年齢など）を追加しました。
    *   Tailwind CSS を使用して、UI見本画像のトンマナを意識した基本的なスタイリングを適用しました。

### 2. 次のステップ
*   実装したログイン・登録機能がバックエンドと連携して正しく動作するかの結合テスト。
*   （必要に応じて）バックエンド側に不足している登録APIの実装。
*   Phase 5「フロントエンドの実装 (店舗・予約・お気に入り)」に着手します。

