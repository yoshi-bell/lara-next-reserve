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
    *   `docs-private/DEV_LOG.md` を読み込み、リファクタリング、UI/UX改善、履歴機能追加の経緯を特定する。

### ステップ 2: 実装状況の検証 (Code Verification)

#### バックエンド (Laravel):
*   [ ] **コントローラー:** 責務分離済み（`AuthenticatedSession`, `User`, `Register`, `Shop`, `Reservation`, `Favorite`）。
*   [ ] **バリデーション:** 全て FormRequest クラスへ移行済み。
*   [ ] **予約履歴:** `ReservationController@index` が `type=history` パラメータに対応済み。
*   [ ] **テスト (100% Green):** `tests/Feature/` 配下に `Authentication`, `Registration`, `Reservation`, `Shop`, `MyPage` の各テストが完備。

#### フロントエンド (Next.js):
*   [ ] **コンポーネント:** `ReservationForm`（予約作成）, `ReservationCard`（表示）が分離済み。
*   [ ] **マイページ:** タブUI（予定/履歴）と、お気に入り解除設定機能が実装済み。
*   [ ] **ナビゲーション:** ヘッダー、ハンバーガーメニュー、ログイン画面の導線修正済み。

### ステップ 3: 結論の導出と報告
*   [ ] **現状の判定:** 全機能の実装、リファクタリング、品質強化、ドキュメント同期が完了。

## 2. 重要事項 (Core Rules)
*   **日本語対応:** 全ての思考と応答を日本語で行うこと。
*   **ドキュメントの同期:** 作業完了時は必ず `DEV_LOG.md` を更新し、その内容に基づいて `AGENT_RECOVERY_MANUAL.md` を最新化すること。

## 3. 想定される結論 (Hypothesis: 2026-01-27時点)

現在のフェーズ: プロジェクト完了

完了していること:

✅ 予約履歴機能（タブ切り替え・再予約導線）の実装。
✅ バックエンド全機能のテスト完備とリファクタリング。
✅ ユーザー設定（LocalStorage）を含むUI/UXの高度な改善。
✅ シーディングデータの多様化（リアルなテスト環境）。
✅ ログイン導線（SWRキャッシュ問題）の解決。

未完了・次のタスク:

🚀 （必要に応じて）デプロイメント。
