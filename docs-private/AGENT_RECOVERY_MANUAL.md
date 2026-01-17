# AIエージェント復旧マニュアル (Final Version)

## 0. エージェントの役割 (Persona)
あなたは「Rese」プロジェクトの リードフルスタックエンジニア です。 あなたのメモリ（コンテキスト）はリセットされましたが、以下の手順を実行することで、前任のエージェントと同じ理解度まで瞬時に復旧し、開発を継続してください。

## 1. 復旧チェックリスト (Recovery Checklist)
以下のステップを順に実行し、各項目の [ ] にチェックを入れながら進めてください。

### ステップ 1: プロジェクトの全体像把握 (High-level Analysis)
*   [ ] **開発計画書の分析:**
    *   `docs-private/DEVELOPMENT_PLAN.md` を読み込み、現在のフェーズとアーキテクチャ方針を特定する。
*   [ ] **直近の作業ログ確認:**
    *   `docs-private/DEV_LOG.md` を読み込み、前回のエージェントが「最後に何を行い、どこで止まったか」を特定する。
*   [ ] **要件と仕様の確認:**
    *   以下のリソースを確認し、機能要件とデータベース構造を把握する。
    *   Googleスプレッドシート: プロジェクト要件シート (アクセス不可の場合はスキップ)
    *   CSV仕様書 (必須):
        *   `docs-private/_Web開発上級 小野江礼行様用案件シート - 機能一覧.csv`
        *   `docs-private/_Web開発上級 小野江礼行様用案件シート - テーブル仕様書.csv`

### ステップ 2: 実装状況の検証 (Code Verification)
マニュアル上の情報と実際のコードが一致しているか、以下の重要ファイル・ディレクトリを読み込んで検証してください。

#### バックエンド (Laravel) の検証:
*   [ ] **ルーティング確認 (最重要):**
    *   `lara-next-reserve/laravel-next-app/routes/web.php`
    *   `lara-next-reserve/laravel-next-app/routes/api.php`
    *   確認事項: `/login`, `/register`, `/api/user` の定義有無。
*   [ ] **データベース構造確認:**
    *   ディレクトリ一覧取得: `lara-next-reserve/laravel-next-app/database/migrations/` (変更履歴の把握)
*   [ ] **モデル定義確認:**
    *   `lara-next-reserve/laravel-next-app/app/Models/User.php`
    *   `lara-next-reserve/laravel-next-app/app/Models/Shop.php`
    *   `lara-next-reserve/laravel-next-app/app/Models/Reservation.php`
    *   `lara-next-reserve/laravel-next-app/app/Models/ReservationSlot.php`
*   [ ] **設定確認:**
    *   `lara-next-reserve/laravel-next-app/bootstrap/app.php` (ミドルウェア設定)

#### フロントエンド (Next.js) の検証:
*   [ ] **ページ構造の把握:**
    *   ディレクトリ一覧取得: `lara-next-reserve/next-frontend-app/src/app/` (App Router構造の確認)
*   [ ] **認証実装確認:**
    *   `lara-next-reserve/next-frontend-app/src/app/api/auth/[...nextauth]/route.ts`
*   [ ] **認証ページ確認:**
    *   ディレクトリ確認: `lara-next-reserve/next-frontend-app/src/app/login/` (login, register フォルダの存在確認)
    *   ディレクトリ確認: `lara-next-reserve/next-frontend-app/src/app/register/` (login, register フォルダの存在確認)

### ステップ 3: UI/UXデザインの確認
*   [ ] **モックアップ分析:**
    *   ディレクトリ `lara-next-reserve/docs-private/yoyaku_ui/` 内の画像を確認し、デザイン要件を再認識する。

### ステップ 4: 結論の導出と報告
*   [ ] **現状の判定:**
    *   以下の「3. 想定される結論」と、ステップ2での調査結果を照らし合わせる。
    *   矛盾があれば、コードの実態を優先する。
*   [ ] **ユーザーへのキックオフ報告:**
    *   **実行結果サマリー:**
        *   [ ] 実行できたタスク（例: ファイル読み込み成功数）
        *   [ ] 実行できなかったタスクや発見した問題点（例: ファイル読み込みエラー、ドキュメントとの矛盾）
    *   **現状分析:**
        *   [ ] 特定した「現在のフェーズ」
        *   [ ] 次に実行すべき具体的なタスク
    *   上記をまとめてユーザーに報告し、作業開始の許可を得る。

## 2. 重要事項 (Core Rules)
*   **日本語対応:** 全ての思考と応答を日本語で行うこと。
*   **破壊的変更の禁止:** 既存の正常に動作しているコードを、理解なしに書き換えないこと。
*   **ドキュメントの同期:** 作業完了時は必ず `DEV_LOG.md` を更新すること。

## 3. 想定される結論 (Hypothesis: 2026-01-16時点)
あくまで目安です。ステップ2の検証結果を優先してください。

現在のフェーズ: Phase 4 (認証機能の実装) - バックエンド実装中

完了していること:

✅ フロントエンドのログイン・登録画面の実装

✅ フロントエンドのNextAuth.js設定とプロバイダー実装

✅ バックエンドのSanctum設定

✅ バックエンドのログインAPI (/login)

未完了・次のタスク:

🚀 バックエンドの新規登録API (/register) の実装

    `routes/web.php` (または `api.php`) へのルート追加

    `RegisteredUserController` (仮) の作成とバリデーション・作成ロジックの実装

🔍 結合テスト