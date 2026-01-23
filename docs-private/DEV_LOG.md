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

---

## 2026-01-18: Phase 4「認証機能の実装」結合テストおよび問題解決

### 1. 完了したタスク

#### フロントエンド (Next.js)
*   **認証機能の結合テストの完了:** 登録・ログイン機能がフロントエンドとバックエンド間で連携して正しく動作することを確認しました。

### 2. 問題発生と解決の経緯

#### 問題1: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` (HTTP 419)
*   **状況:** `http://localhost:3000/register` で登録ボタンを押した際に発生。
*   **初期原因の仮説:** フロントエンドのリクエストURL間違いやLaravelバックエンドでのエラー。
*   **判明した真の原因:**
    1.  **フロントエンドの環境変数参照ミス:** クライアントコンポーネント (`"use client"`) で `process.env.BACKEND_URL` を直接参照していたため、`undefined` になり、Next.jsの404 HTMLが返されていた。
    2.  **CSRFトークンの欠如:** `fetch` APIでは `X-XSRF-TOKEN` ヘッダーが自動で付与されないため、LaravelのCSRF保護に引っかかっていた。
*   **解決策:**
    1.  `.env.local` の `BACKEND_URL` を `NEXT_PUBLIC_BACKEND_URL` に変更し、`register/page.tsx` で `process.env.NEXT_PUBLIC_BACKEND_URL` を参照するように修正。
    2.  `routes/web.php` の `/login`, `/logout` ルートを `routes/api.php` に移動し、全ての認証APIを `/api/` プレフィックスで統一。
    3.  `config/cors.php` を作成し、`supports_credentials = true`、`allowed_origins` に `http://localhost:3000` を設定。
    4.  `.env` に `SESSION_SECURE_COOKIE=false` を追加。
    5.  `axios` を導入し、`src/lib/axios.ts` で `baseURL` と `withCredentials: true` を設定。さらに、`axios` のリクエストインターセプターを使用し、`js-cookie` で `XSRF-TOKEN` を読み取り、`X-XSRF-TOKEN` ヘッダーに明示的に設定することで、CSRF保護を通過させる。
    6.  Laravelのアプリケーションサーバーを再起動し、設定キャッシュをクリア (`sail artisan config:clear`)。

#### 問題2: `The phone number field is required.`
*   **状況:** 登録時、電話番号が必須というバリデーションエラーが発生。
*   **原因:** フロントエンドの `axios.post` で送信するデータのキー名 (`phone`) と、バックエンド (`RegisterController`) のバリデーションが期待するキー名 (`phone_number`) が一致していなかったため。
*   **解決策:** `register/page.tsx` で送信するデータのキー名を `phone_number` に修正。

#### 問題3: `Failed to parse URL from undefined/api/login`
*   **状況:** ログイン時、APIリクエストのURL解析エラーが発生。
*   **原因:** `app/api/auth/[...nextauth]/route.ts` の `authorize` 関数内で、`process.env.BACKEND_URL` を参照していたため、Next.jsの環境変数ルール (`NEXT_PUBLIC_` プレフィックス) により `undefined` になっていた。
*   **判明したより良い解決策:** 登録機能が `axios` ベースにリファクタリングされたため、ログイン機能も `axios` ベースに統一する。
    *   `login/page.tsx` を `axios` を使うように全面的に書き換え。

### 3. 最終的な動作確認結果

*   **新規登録:** `http://localhost:3000/register` から新しいユーザー情報で登録を試行。
    *   登録に成功し、`http://localhost:3000/login` へリダイレクトされることを確認。
    *   開発者ツール（Networkタブ）で、`/sanctum/csrf-cookie` および `/api/register` が正常に処理されていることを確認。
*   **ログイン:** `http://localhost:3000/login` から登録したユーザー情報でログインを試行。
    *   ログインに成功し、`http://localhost:3000/` （トップページ）へリダイレクトされることを確認。

### 4. 次のステップ
*   `DEVELOPMENT_PLAN.md` のチェックリストに従い、 Phase 5「フロントエンドの実装 (店舗・予約・お気に入り)」に着手します。

---

## 2026-01-18: Phase 4「認証機能の実装」バックエンド新規登録API実装と動作確認

### 1. 完了したタスク

#### バックエンド (Laravel)
*   **新規登録API (`/register`) の実装:**
    *   `routes/web.php` から `/register` ルートの定義を削除し、`routes/api.php` に移動しました。
    *   `routes/api.php` に `POST /register` ルートを追加し、以下の処理を実装しました。
        *   リクエストデータのバリデーション（名前、メールアドレス、パスワード、電話番号、性別、年齢）
        *   `unique:users` ルールによるメールアドレスの重複チェック
        *   `Hash::make()` によるパスワードのハッシュ化と`User`モデルによるデータベースへの保存
        *   ユーザー登録後の自動ログイン (`Auth::login($user)`)
        *   適切な `use` 宣言 (`Illuminate\Support\Facades\Hash;`, `Illuminate\Support\Facades\Auth;`, `App\Models\User;`) を追加しました。

### 2. 動作確認結果

#### バックエンド (Laravel) 新規登録API (`POST /api/register`)
*   **レスポンス確認:**
    *   cURLを使用して有効なデータでリクエストした結果、HTTPステータス `200 OK` が返され、新しく作成されたユーザーのJSONデータが含まれていることを確認しました。
    *   意図的に既存のメールアドレスでリクエストした結果、HTTPステータス `422 Unprocessable Content` が返され、「The email has already been taken.」という適切なバリデーションエラーメッセージが含まれていることを確認しました。
*   **データ整合性:**
    *   `sail artisan tinker` を使用し、`\App\Models\User::latest()->first();` コマンドでデータベースに新規ユーザーが正しく追加されており、パスワードがハッシュ化されていることを確認しました。
*   **エラーハンドリング:**
    *   バリデーションエラーのシナリオが正しく処理されることを確認しました。

### 3. 次のステップ
*   `DEVELOPMENT_PLAN.md` のチェックリストに従い、 Phase 4 の残りのタスク、具体的には**認証機能の結合テスト**に進みます。

---

## 2026-01-19: Phase 5「フロントエンドの実装」店舗一覧ページのUI構築完了

### 1. 完了したタスク

#### フロントエンド (Next.js)
*   **データ取得ロジックの実装:**
    *   `swr` を導入し、`src/hooks/useShops.ts` にカスタムフック `useShops` を実装しました。
    *   `axios` インスタンスを使用して `/api/shops` からデータを取得するようにしました。
    *   `Shop` インターフェースに `Area` と `Genre` のリレーション定義を追加し、型安全性を確保しました。
*   **店舗一覧ページ (`/shops`) の実装:**
    *   `src/app/shops/page.tsx` を作成し、店舗データをカード形式で表示するUIを構築しました。
    *   `Next.js` の `Image` コンポーネントを使用し、`fill`, `sizes`, `style={{ objectFit: 'cover' }}` を適切に設定してレスポンシブ対応を行いました。
    *   外部画像ホスト (`coachtech-matter.s3-ap-northeast-1.amazonaws.com`) を `next.config.ts` の `remotePatterns` に追加しました。
*   **パフォーマンス最適化:**
    *   `LCP (Largest Contentful Paint)` 警告に対処するため、グリッドレイアウトの1行目に表示される最初の4枚の画像に対して `priority={index < 4}` を設定し、優先読み込みを行うようにしました。
    *   画像URLが存在しない場合のフォールバックとして、プレースホルダーを表示するロジックを追加しました。

### 2. 動作確認結果

*   **データ表示:**
    *   `http://localhost:3000/shops` にアクセスし、店舗名、エリア名、ジャンル名、画像が正しく表示されることを確認しました。
*   **パフォーマンス:**
    *   プロダクションビルド (`npm run build` -> `npm start`) 環境において、コンソールにLCPや`sizes`プロパティに関する警告が表示されないことを確認しました。

### 3. 次のステップ
*   `WORKFLOW.md` に従い、**検索機能の実装**に着手します。

---

## 2026-01-19: Phase 5「フロントエンドの実装」検索機能の実装完了とドキュメント再編成

### 1. 完了したタスク

#### バックエンド (Laravel)
*   **エリア・ジャンル取得APIの実装:**
    *   `AreaController`, `GenreController` を作成し、一覧を取得する `index` メソッドを実装しました。
    *   `routes/api.php` に `GET /api/areas`, `GET /api/genres` ルートを追加しました。

#### フロントエンド (Next.js)
*   **検索ロジックの実装:**
    *   エリア・ジャンル取得用のカスタムフック `useAreas`, `useGenres` を実装しました。
    *   `useShops` フックを拡張し、検索パラメータ（`areaId`, `genreId`, `name`）をクエリ文字列としてAPIに送信し、SWRのキーに含めることで自動再取得を実現しました。
    *   SWRの `keepPreviousData: true` オプションを有効化し、検索時の画面のちらつき（リロード感）を解消しました。
*   **検索UIの実装:**
    *   店舗一覧ページに、エリア選択、ジャンル選択、キーワード入力のUIを実装し、リアルタイム検索を可能にしました。

#### リファクタリングとドキュメント整理
*   **ルートパスの要件準拠:**
    *   要件定義書に基づき、店舗一覧ページのパスを `/shops` からトップページ (`/`) へ移動しました。
    *   店舗詳細ページの予定パスを `/shops/[id]` から `/detail/[id]` に修正しました。
*   **ドキュメント構成の刷新:**
    *   AIエージェントのプロセス遵守と柔軟性を両立させるため、ドキュメントを「憲法（`DEVELOPMENT_PLAN.md`）」と「手順書（`WORKFLOW.md`）」に分離しました。
    *   `WORKFLOW.md` に「【現在進行中のタスク】 (Active Context)」セクションを設け、作業の透明性を高めました。

### 2. 動作確認結果

*   **検索機能:**
    *   エリア、ジャンル、キーワードの各条件、および組み合わせによる店舗の絞り込みが正常に動作することを確認しました。
*   **UX:**
    *   検索条件変更時にページ全体のリロードが発生せず、店舗一覧のみがスムーズに更新されることを確認しました。

### 3. 次のステップ
*   `WORKFLOW.md` に従い、**店舗詳細ページの実装**に着手します。

---

## 2026-01-19: Phase 5「フロントエンドの実装」店舗詳細ページの実装完了

### 1. 完了したタスク

#### フロントエンド (Next.js)
*   **データ取得ロジックの実装:**
    *   `src/hooks/useShopDetail.ts` にカスタムフック `useShopDetail` を実装しました。
    *   `useSWR` を使用して `/api/shops/{id}` から単一店舗のデータを取得するようにしました。可読性向上のため、フック名を `useShop` から `useShopDetail` に変更しました。
*   **店舗詳細ページ (`/detail/[id]`) の実装:**
    *   `src/app/detail/[shop_id]` ディレクトリを作成し、詳細ページ用の `page.tsx` を実装しました。
    *   URLパラメータから店舗IDを取得し、`useShopDetail` でデータをフェッチして表示するUIを構築しました。
    *   見本画像 (`shop_detail.png`) を参考に、左側に店舗情報、右側に予約フォーム（プレースホルダー）を配置するレイアウトを適用しました。
*   **画面遷移の実装:**
    *   トップページ (`/`) の店舗カード内の「詳しく見る」ボタンを `Link` コンポーネントに置き換え、詳細ページへの遷移を有効化しました。

### 2. 動作確認結果

*   **データ表示:**
    *   トップページから任意の店舗をクリックすると、正しい詳細ページ (`/detail/[id]`) に遷移することを確認しました。
    *   詳細ページにおいて、店舗名、画像、エリア、ジャンル、説明文が正しく表示されることを確認しました。
*   **UI/UX:**
    *   詳細ページのデザインが見本に沿ったものであることを確認しました。
    *   「戻る」ボタン（ヘッダーの `<` アイコン）でトップページに戻れることを確認しました。

### 3. 次のステップ
*   `WORKFLOW.md` に従い、Phase 5-2 **「お気に入り機能の実装」**に着手します。

---

## 2026-01-19: Phase 5「フロントエンドの実装」お気に入り機能の実装完了

### 1. 完了したタスク

#### バックエンド (Laravel)
*   **お気に入り登録/解除APIの実装:**
    *   `FavoriteController` を作成し、`store` (登録) / `destroy` (解除) メソッドを実装しました。
    *   `routes/api.php` に `/shops/{shop}/favorite` のルートを追加しました（`auth:sanctum` 保護）。
*   **店舗データの拡張:**
    *   `ShopController` の `index` と `show` メソッドを修正し、`withExists(['favorites' ...])` を使用して、ログインユーザーがその店舗をお気に入り登録しているかどうかの判定 (`favorites_exists`) をレスポンスに含めるようにしました。

#### フロントエンド (Next.js)
*   **データ取得・更新ロジックの実装:**
    *   `src/hooks/useFavorite.ts` にカスタムフック `useFavorite` を実装しました。
    *   `useSWRConfig` の `mutate` を使用した **Global Mutation** を採用し、お気に入り更新時に一覧ページと詳細ページのキャッシュを自動更新するようにしました。
    *   `Shop` インターフェースに `favorites_exists` プロパティを追加しました。
*   **UIコンポーネントの実装:**
    *   店舗カードを `src/components/ShopCard.tsx` としてコンポーネント化し、お気に入りボタンのロジックを集約しました。
    *   `ShopCard.tsx` ではローカルステート (`useState`, `useEffect`) を廃止し、SWRから渡されるデータを直接参照することで、キャッシュとの整合性を保つ設計にリファクタリングしました。
    *   店舗一覧ページ (`src/app/page.tsx`) を修正し、`ShopCard` コンポーネントを使用するようにしました。
    *   店舗詳細ページ (`src/app/detail/[shop_id]/page.tsx`) から、不要なお気に入りボタンの実装（見本デザインにないため）を削除し、コードをクリーンアップしました。

### 2. 動作確認結果

*   **お気に入り登録/解除:**
    *   店舗一覧ページでハートアイコンをクリックすると、お気に入り登録/解除が正しく行われ、アイコンの色が即座に切り替わることを確認しました。
    *   リロードしても状態が維持されることを確認しました。
*   **データ整合性:**
    *   一覧ページでお気に入りを変更した後、詳細ページに遷移し、戻るボタンで一覧ページに戻っても、お気に入り状態（ハートの色）が正しく反映されていることを確認しました（SWRのキャッシュ更新が正常に機能）。
*   **データベース:**
    *   `phpMyAdmin` 等で `favorites` テーブルを確認し、レコードの作成・削除が正しく行われていることを確認しました。

### 3. 次のステップ
*   `WORKFLOW.md` に従い、Phase 5-2 **「予約機能の実装」**に着手します。

