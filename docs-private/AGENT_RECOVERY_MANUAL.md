# AIエージェント復旧マニュアル (Final Version)

## 0. エージェントの役割 (Persona)
あなたは「Rese」プロジェクトの リードフルスタックエンジニア です。 あなたのメモリ（コンテキスト）はリセットされましたが、以下の手順を実行することで、前任のエージェントと同じ理解度まで瞬時に復旧し、開発を継続してください。

## 1. 復旧チェックリスト (Recovery Checklist)
以下のステップを順に実行し、各項目の [ ] にチェックを入れながら進めてください。

### ステップ 1: プロジェクトの全体像把握 (High-level Analysis)
*   [ ] **開発ルールの分析 (`DEVELOPMENT_PLAN.md`):**
    *   `docs-private/DEVELOPMENT_PLAN.md` を読み込み、プロジェクトの**不変の原則、設計思想、重要事項、ガイドライン**を特定する。（これがプロジェクトの「憲法」である。）
*   [ ] **直近のワークフロー確認 (`WORKFLOW.md`):**
    *   `docs-private/WORKFLOW.md` を読み込み、現在のフェーズ、**現在進行中のタスク**、具体的な実行手順（ロードマップのチェックリスト）を特定する。（これが「手順書」である。）
*   [ ] **直近の作業ログ確認 (`DEV_LOG.md`):**
    *   `docs-private/DEV_LOG.md` を読み込み、前回のエージェントが「最後に何を行い、どこで止まったか」を特定する。
*   [ ] **要件と仕様の確認:**
    *   以下のリソースを確認し、機能要件とデータベース構造を把握する。
    *   CSV仕様書 (必須):
        *   `docs-private/_Web開発上級 小野江礼行様用案件シート - 機能一覧.csv`
        *   `docs-private/_Web開発上級 小野江礼行様用案件シート - テーブル仕様書.csv`
        *   `docs-private/_Web開発上級 小野江礼行様用案件シート - 基本設計書.csv`

### ステップ 2: 実装状況の検証 (Code Verification)
マニュアル上の情報と実際のコードが一致しているか、以下の重要ファイル・ディレクトリを読み込んで検証してください。

#### バックエンド (Laravel) の検証:
*   [ ] **バリデーション (FormRequest化済み):**
    *   `app/Http/Requests/LoginRequest.php`
    *   `app/Http/Requests/RegisterRequest.php`
    *   `app/Http/Requests/StoreReservationRequest.php` (重複予約チェック実装済み)
*   [ ] **コントローラー (リファクタリング済み):**
    *   `app/Http/Controllers/Api/AuthenticatedSessionController.php`
    *   `app/Http/Controllers/Api/UserController.php`
    *   `app/Http/Controllers/Api/RegisterController.php`
*   [ ] **テスト確認 (Green):**
    *   `tests/Feature/Auth/AuthenticationTest.php`
    *   `tests/Feature/Auth/RegistrationTest.php`
    *   `tests/Feature/ReservationTest.php`

#### フロントエンド (Next.js) の検証:
*   [ ] **バリデーション設定:**
    *   各フォーム（Login, Register）に `noValidate` 属性が追加され、バックエンドバリデーションを直接テスト可能な状態。

### ステップ 3: UI/UXデザインの確認
*   [ ] **モックアップ分析:**
    *   `lara-next-reserve/docs-private/yoyaku_ui/` 内の画像。ログイン・登録画面はこれに準拠。

## 2. 重要事項 (Core Rules)
*   **日本語対応:** 全ての思考と応答を日本語で行うこと。
*   **ドキュメントの同期:** 作業完了時は必ず `DEV_LOG.md` を更新し、その内容に基づいて `AGENT_RECOVERY_MANUAL.md` を最新化すること。
*   **ルールの優先:** `WORKFLOW.md` 冒頭の「開発ルール」を最優先で遵守すること。

## 3. 想定される結論 (Hypothesis: 2026-01-26時点)

現在のフェーズ: Phase 6 (仕上げと拡張) - 完了

完了していること:

✅ 認証・予約機能のリファクタリング（FormRequest化、コントローラー分離）完了。
✅ バリデーションメッセージの日本語化、重複予約防止ロジックの実装完了。
✅ 全主要機能の Feature Test による品質担保済み。
✅ 予約リマインダーメール送信機能（バッチ処理）の実装・確認済み。
✅ README.md、基本設計書（CSV）の完全同期。

未完了・次のタスク:

🚀 ユーザーからの実装に関する最終質疑応答への対応。
🚀 本番デプロイの検討（必要に応じて）。
