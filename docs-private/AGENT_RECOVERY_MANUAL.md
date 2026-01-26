# AIエージェント復旧マニュアル (Final Version)

## 0. エージェントの役割 (Persona)
あなたは「Rese」プロジェクトの リードフルスタックエンジニア です。 あなたのメモリ（コンテキスト）はリセットされましたが、以下の手順を実行することで、前任のエージェントと同じ理解度まで瞬時に復旧し、開発を継続してください。

## 1. 復旧チェックリスト (Recovery Checklist)
以下のステップを順に実行し、各項目の [ ] にチェックを入れながら進めてください。

### ステップ 1: プロジェクトの全体像把握 (High-level Analysis)
*   [ ] **開発ルールの分析 (`DEVELOPMENT_PLAN.md`):**
    *   `docs-private/DEVELOPMENT_PLAN.md` を読み込み、プロジェクトの不変の原則を特定する。
*   [ ] **直近のワークフロー確認 (`WORKFLOW.md`):**
    *   `docs-private/WORKFLOW.md` の「開発ルール」を最優先で遵守すること。
*   [ ] **直近の作業ログ確認 (`DEV_LOG.md`):**
    *   `docs-private/DEV_LOG.md` を読み込み、リファクタリングと日本語化の経緯を特定する。
*   [ ] **要件と仕様の確認:**
    *   `docs-private/` 内のCSVファイル群（基本設計書、テーブル仕様書、機能一覧）を確認する。

### ステップ 2: 実装状況の検証 (Code Verification)

#### バックエンド (Laravel):
*   [ ] **コントローラー:** `AuthenticatedSessionController`, `UserController`, `RegisterController` への責務分離が完了。
*   [ ] **バリデーション:** `app/Http/Requests/` 配下の FormRequest クラス群（日本語化済み）。
*   [ ] **日本語化設定:** 
    *   `config/app.php` (ロケール: ja)
    *   `AppServiceProvider.php` (ロケール強制)
    *   `bootstrap/app.php` (AuthenticationException の日本語オーバーライド)
*   [ ] **テスト:** `tests/Feature/` 配下の網羅的なテスト（Green）。

#### フロントエンド (Next.js):
*   [ ] **コンポーネント:** `ReservationForm.tsx` の分離が完了。
*   [ ] **ページ:** `detail/[shop_id]/page.tsx` は表示に特化。
*   [ ] **バリデーション:** 各フォームに `noValidate` 属性。

### ステップ 3: 結論の導出と報告
*   [ ] **現状の判定:** 全機能の実装、リファクタリング、ドキュメント同期が完了。

## 2. 重要事項 (Core Rules)
*   **日本語対応:** 全ての思考と応答を日本語で行うこと。
*   **ドキュメントの同期:** 作業完了時は必ず `DEV_LOG.md` を更新し、その内容に基づいて `AGENT_RECOVERY_MANUAL.md` を最新化すること。

## 3. 想定される結論 (Hypothesis: 2026-01-26時点)

現在のフェーズ: プロジェクト完了

完了していること:

✅ 認証・予約機能の完全なリファクタリング（FormRequest, Controller分離）。
✅ アプリケーション全体の完全日本語化（システム例外含む）。
✅ フロントエンドのコンポーネント設計最適化。
✅ 全主要機能の Feature Test 完備。
✅ README.md、基本設計書（CSV）の完全同期。

未完了・次のタスク:

🚀 プロジェクトの最終確認と完了報告。
🚀 （必要に応じて）デプロイメント。