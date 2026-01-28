# 🔵 メタ定義: このファイルの責務 (AIエージェント用)
> **AIエージェントへの指示 (Prompt Repetition Strategy):** 
> このファイルはプロジェクトの「設計図」であり「憲法」です。
> 実装を開始する前に、内容を**「合計2回」**読み込み、不変の原則を完全に理解してください。

*   **役割:** プロジェクトの「仕様」「設計方針」「不変の原則」の定義。
*   **読むべきタイミング:** 新しい機能の実装、DB変更、または設計上の判断が必要な時。
*   **思考の優先順位:** 設計と方針に関して最優先。ここにある原則に反するコードを書いてはならない。
*   **含まない情報:** 具体的なタスクの進捗（WORKFLOW.md を参照）、過去の変更履歴（DEV_LOG.md を参照）。

---

# [PROJECT_NAME] システム仕様書兼開発計画書 (System Spec)

## ⚖️ プロジェクト憲法 (The Constitution)
> **警告:** 以下のルールは、本プロジェクトにおいて**最優先される絶対的な制約**である。
> AIエージェントは独自の判断でこれに違反する提案や実装を行ってはならない。

1.  **言語とコミットの遵守 (Language & Commit Rules):**
    *   思考、応答、ドキュメント記述はすべて**日本語**で行うこと。
    *   Gitコミットメッセージは「日本語」かつ「プレフィックス（`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`）」を必ず使用すること。
2.  **品質の保証 (Testing & Verification):**
    *   新機能の実装やリファクタリングを行う際は、必ず対応するテストコードを作成・実行し、既存の機能を破壊していないことを証明すること。
3.  **整合性の維持 (Documentation Sync):**
    *   `git push` を行う直前に、必ずドキュメントを同期させること。
4.  **シンプルさの追求 (YAGNI):**
    *   現在の要件を満たす最もシンプルでクリーンな実装を選択すること。

---

## 🏗️ アーキテクチャと設計思想 (Architecture & Philosophy)

### アーキテクチャ
*   **[ARCHITECTURE_TYPE, e.g., Monorepo]:** [DESCRIPTION]
*   **Backend:** [TECHNOLOGY, e.g., Laravel 11]
*   **Frontend:** [TECHNOLOGY, e.g., Next.js 16]

### 開発方針
*   **機能優先 (Function First):** UIの装飾よりも、データの正確な流れと機能の実装を最優先する。
*   **[OTHER_POLICY]:** [DESCRIPTION]

---

## 🔒 技術仕様と重要ルール (Technical Specs & Rules)

### データベース設計
*   **ER図 / テーブル定義:** 別途 `tables.csv` や `ER_DIAGRAM.md` を参照（またはここに記述）。
*   **制約:** 外部キー制約、ユニーク制約を適切に設定すること。

### Git運用とドキュメント管理
*   **プライベート資料:** 設計資料、CSV、開発ログは `docs-private/` で一元管理する。
*   **公開とバックアップ:** 開発完了後は `docs-private/` を `.gitignore` に追加して非公開とし、外部ストレージにバックアップを退避させる。

---

## 🎨 実装ガイドライン (Implementation Guidelines)

### フロントエンド
*   **自動整形:** `prettier` 等のフォーマッタを導入・適用すること。
*   **コンポーネント設計:** 再利用可能なパーツはコンポーネント化し、単一責任の原則を守る。

### バックエンド
*   **命名規則:** 言語やフレームワークの標準的な命名規則（PascalCase, camelCase, snake_case 等）を厳守すること。
*   **クリーンコード:** 責務の分離を意識すること。

---

## 📂 ドキュメント構成 (Documentation Structure)

*   **`docs-private/WORKFLOW.md`:** 開発の手順書・チェックリスト。
*   **`docs-private/DEV_LOG.md`:** 開発の航海日誌・変更履歴。
*   **`docs-private/AGENT_RECOVERY_MANUAL.md`:** エージェントの初期化・復旧マニュアル。
*   **`docs-private/SYSTEM_SPEC.md`:** 本書（仕様書・憲法）。
