# 教材分析（Laravel + Next.js編 - 統合版）

## 1. チュートリアルの全体像

### 目的
Laravel（バックエンド）とNext.js（フロントエンド）を組み合わせた、実践的なWebアプリケーションの構築スキルを習得する。

### 対象技術
- **バックエンド**: Laravel
- **フロントエンド**: Next.js, React, TypeScript
- **開発環境**: Docker (Laravel Sail)
- **認証**: Laravel Sanctum, NextAuth.js
- **その他**: Tailwind CSS, ESLint

### アーキテクチャ
- **ヘッドレス構成**: バックエンド（APIサーバー）とフロントエンドを明確に分離する。
  - **Laravel**: APIとして、データベース操作、ビジネスロジック、認証などを担当。
  - **Next.js**: UIレンダリング、ユーザーインタラクション、API呼び出しを担当。

### 学習ステップ
1.  **Chapter 1: 開発環境構築**
2.  **Chapter 2: 商品一覧ページの作成**
3.  **Chapter 3: 認証機能の実装**

---

## 2. Chapter 1: 開発環境構築 詳細

### Chapter 1 のゴール
- Laravel Sail を利用して、バックエンド用のDocker開発環境を構築する。
- `create-next-app` を利用して、フロントエンド用の開発環境を構築する。
- 最終的に、以下の2つのサーバーがローカルで独立して動作している状態を作る。
  - Laravel 開発サーバー: `http://localhost`
  - Next.js 開発サーバー: `http://localhost:3000`

### 各ステップの詳細

#### A. バックエンド (Laravel) のセットアップ
1.  **前提条件**: Docker Desktop がインストール・実行されていること。
2.  **プロジェクト作成**:
    - `curl -s "https://laravel.build/laravel-next-app" | bash` を実行。
    - `laravel-next-app` という名称のプロジェクトが作成される。
3.  **Sail (Dockerコンテナ) の起動**:
    - `cd laravel-next-app`
    - `./vendor/bin/sail up -d` を実行。
4.  **動作確認**:
    - ブラウザで `http://localhost` にアクセスし、Laravelのウェルカムページが表示されることを確認。
5.  **キーコンセプト**:
    - **Laravel Sail**: DockerベースのLaravel公式開発環境。PC環境を汚さずに、チームで環境を統一できる。
    - **`sail` コマンド**: `sail artisan <...>`, `sail composer <...>` のように、コンテナ内で各種コマンドを実行するためのインターフェース。

#### B. フロントエンド (Next.js) のセットアップ
1.  **前提条件**: Node.js (LTS版) がインストールされていること。
2.  **プロジェクト作成**:
    - `npx create-next-app@latest` を実行。
    - `next-frontend-app` という名称でプロジェクトを作成。
    - **推奨設定**:
      - TypeScript: Yes
      - ESLint: Yes
      - Tailwind CSS: Yes
      - `src/` directory: Yes
      - App Router: Yes
3.  **開発サーバーの起動**:
    - `cd next-frontend-app`
    - `npm run dev` を実行。
4.  **動作確認**:
    - ブラウザで `http://localhost:3000` にアクセスし、Next.jsのウェルカムページが表示されることを確認。
5.  **初期化**:
    - `src/app/page.tsx` をシンプルな内容に書き換えて、開発準備を整える。
6.  **キーコンセプト**:
    - **`create-next-app`**: 対話形式で推奨設定のNext.jsプロジェクトを構築する公式ツール。
    - **App Router**: Next.js 13以降で推奨されている新しいルーティングシステム。
    - **Fast Refresh**: コード変更時にブラウザが自動リロードされる機能。

---

## 3. Chapter 2: 商品一覧ページの作成 詳細

### Chapter 2 のゴール
- Laravel で商品データを提供するAPIを作成する。
- Next.js からそのAPIを呼び出し、取得した商品データを整形して一覧表示する。
- バックエンドとフロントエンドが連携する一連の流れを体験し、CORSエラーの解決方法を学ぶ。

### 各ステップの詳細

#### A. バックエンド (Laravel API) の構築
1.  **モデルとマイグレーション作成**:
    - `sail artisan make:model Product -m` で `Product` モデルとマイグレーションファイルを生成。
    - マイグレーションファイルで `products` テーブルのスキーマ（name, description, priceなど）を定義。
2.  **ダミーデータ準備 (Seeder)**:
    - `sail artisan make:seeder ProductSeeder` でSeederを作成。
    - `ProductSeeder.php` にダミーデータ（`Product::create([...])` や `Product::factory()`）を生成するコードを記述。
    - `DatabaseSeeder.php` から `ProductSeeder` を呼び出すように設定。
3.  **DB初期化とデータ投入**:
    - `sail artisan migrate:fresh --seed` を実行し、テーブル作成とデータ投入を一度に行う。
4.  **コントローラーとルーティング**:
    - `sail artisan make:controller ProductController --api` でAPI用のコントローラーを作成。
    - `ProductController` の `index` メソッドで全商品データを取得し、JSONで返すロジックを実装 (`response()->json(Product::all())`)。
    - `routes/api.php` で `/products` へのGETリクエストと `ProductController@index` を紐付ける。
5.  **動作確認**:
    - `http://localhost/api/products` にアクセスし、商品データがJSON形式で返されることを確認。

#### B. フロントエンド (Next.js) でのAPI呼び出しと表示
1.  **環境変数設定**:
    - Next.jsプロジェクトのルートに `.env.local` を作成。
    - `NEXT_PUBLIC_API_BASE_URL=http://localhost/api` を記述し、APIのベースURLを管理。
    - **注意**: `.env.local` 変更後は開発サーバーの再起動が必要。
2.  **CORSエラーへの対応**:
    - **原因**: ブラウザのセキュリティ機能により、異なるオリジン（`http://localhost:3000` と `http://localhost`）間の通信がブロックされるため。
    - **解決策**: Laravel側でリクエストを許可する設定を行う。
    - **手順**:
        1. Laravelプロジェクトの `.env` ファイルに `CORS_ALLOWED_ORIGINS=http://localhost:3000` を追記。
        2. `sail down` -> `sail up -d` でLaravelのコンテナを再起動。
3.  **API呼び出し実装**:
    - `src/app/products/page.tsx` を作成。
    - `interface Product` でAPIから取得するデータの型を定義。
    - `async function getProducts()` 内で `fetch` を使い、APIを呼び出す。
        - `cache: "no-store"` オプションで開発中のキャッシュを無効化。
    - ページコンポーネント `ProductsPage` を `async` 関数として定義し、`await getProducts()` でデータを取得。
4.  **データ表示 (UI実装)**:
    - 取得した商品データの配列を `.map()` メソッドでループ処理。
    - 各商品データに対して、表示用の `ProductCard` コンポーネントを生成する。
    - **Reactのルール**: `map` 内で生成する各コンポーネントには、一意な `key` プロパティ（例: `key={product.id}`）を指定する。
    - Tailwind CSSのユーティリティクラスを使い、カード形式のレイアウトを構築。
5.  **最終確認**:
    - `http://localhost:3000/products` にアクセスし、商品一覧がカード形式で表示されることを確認。

---

## 4. Chapter 3: 認証機能の実装 詳細

### Chapter 3 のゴール
- Laravel Sanctum を用いて、SPA（シングルページアプリケーション）向けの認証APIを準備する。
- NextAuth.js を用いて、Next.js側にログインフォームや認証状態の管理機能を実装する。
- ログイン・ログアウトといった一連の認証フローを完成させる。

### 主要コンセプト
- **ステートフル認証 (Cookieベース)**: SanctumのSPA認証ガードを使用。Laravelが発行するセッションCookieをフロントエンドと共有することで認証状態を維持する。従来のWebアプリケーションで一般的な方法。
- **NextAuth.js**: Next.jsに特化した認証ライブラリ。様々な認証方式を抽象化し、簡単な設定で導入できる。`useSession` フックによる状態管理が強力。

### 各ステップの詳細

#### A. バックエンド (Laravel Sanctum) の設定
1.  **Sanctumインストール**:
    - `sail composer require laravel/sanctum`
2.  **設定ファイル等の発行**:
    - `sail artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
3.  **マイグレーション**:
    - `sail artisan migrate` を実行し `personal_access_tokens` テーブルを作成。
4.  **ミドルウェア設定**:
    - `app/Http/Kernel.php` の `api` ミドルウェアグループに `\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class` を追加。これがSPA認証の要。
5.  **環境変数 (`.env`) 設定**:
    - `SANCTUM_STATEFUL_DOMAINS=localhost:3000`: フロントエンドのドメインを指定。
    - `SESSION_DOMAIN=localhost`: サブドメイン間でCookieを共有するために設定。
    - `CORS_SUPPORTS_CREDENTIALS=true`: オリジン間で認証情報（Cookie）の送受信を許可する設定。

#### B. フロントエンド (NextAuth.js) の設定
1.  **NextAuth.jsインストール**:
    - `npm install next-auth`
2.  **認証APIルート作成**:
    - `src/app/api/auth/[...nextauth]/route.ts` に設定を記述。
3.  **プロバイダー設定**:
    - `CredentialsProvider` を使用し、`authorize` 関数内にLaravel APIとの通信ロジックを実装。
    - **認証フロー**:
        1. `/login` (Laravel) にメール・パスワードを送信。
        2. 成功するとLaravelからセッションCookieが返る。
        3. そのCookieを使って `/api/user` (Laravel) にアクセスし、ユーザー情報を取得。
        4. 取得したユーザー情報をNextAuth.jsに返す。
4.  **コールバック設定**:
    - `jwt` と `session` のコールバックを使い、取得したユーザー情報をNextAuth.jsのセッションオブジェクトに格納する。
5.  **SessionProviderの配置**:
    - `useSession` フックをアプリ全体で使えるようにするため、ルートレイアウト (`layout.tsx`) で子要素を `SessionProvider` でラップする。

#### C. ログイン・ログアウト機能の実装
1.  **バックエンドのルート定義**:
    - **ユーザー情報取得**: `routes/api.php` に `auth:sanctum` ミドルウェアで保護された `/user` ルートを作成。
    - **ログイン・ログアウト**: `routes/web.php` に `/login`, `/logout` ルートを作成。セッションを操作するため `web` ミドルウェアグループ内に定義する。
2.  **フロントエンドのUI作成**:
    - **ログインページ**: Client Component (`"use client"`) として作成。`signIn` 関数を呼び出してログイン処理を実行。
    - **ヘッダー**: `useSession` フックで認証状態を取得し、ユーザー名やログイン/ログアウトボタンを動的に表示する。ログアウトは `signOut` 関数を実行。
3.  **テストユーザー作成**:
    - `sail artisan tinker` を使い、動作確認用のユーザーをデータベースに作成する。

#### D. ハンズオン (10-3-4) で示されたアプローチについて
- チュートリアルの最終ハンズオンでは、Sanctumの **APIトークン認証（ステートレス）** に近い実装例が示されている。これは、`user->createToken('auth-token')->plainTextToken` でトークンを生成し、フロントエンドはそのトークンをリクエストヘッダーに含めてAPIを利用する方法。
- 一方、チュートリアルの本編 (10-3-1〜10-3-3) で解説されているのは **SPA認証（ステートフル）** であり、Cookieを利用する方法。
- これらは異なる認証方式であり、学習者は混乱しないよう注意が必要。この教材の主眼は、より伝統的でセキュアな **SPA認証（Cookieベース）** であると解釈するのが妥当。
