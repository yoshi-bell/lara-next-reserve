# AIエージェント復旧マニュアル

## 1. 目的
このドキュメントは、新しいAIエージェントが「Rese」プロジェクトの現在の状態を迅速に理解し、コンテキストロス（例：エージェントのクラッシュ）が発生した場合に開発を迅速に復旧・継続するための指示を提供します。

## 2. 復旧手順
新しいエージェントは以下の手順を実行する必要があります。

### ステップ1: 高レベルドキュメントの分析
プロジェクトの目標、計画、履歴を理解するために、以下のドキュメントファイルの内容を読み込み、分析します。

- プロジェクト要件Googleシート: https://docs.google.com/spreadsheets/d/1UC0eOFVqejIyeVc9782ox9MVYrekaPh3Ulp3oi4WTLs/edit?gid=935968078#gid=935968078
- `lara-next-reserve/docs-private/DEVELOPMENT_PLAN.md`
- `lara-next-reserve/docs-private/DEV_LOG.md`
- `lara-next-reserve/docs-private/_Web開発上級 小野江礼行様用案件シート - 機能一覧.csv`
- `lara-next-reserve/docs-private/_Web開発上級 小野江礼行様用案件シート - テーブル仕様書.csv`

### ステップ2: 主要なソースコードの分析
実装の詳細を理解するために、以下の主要なソースコードファイルおよびディレクトリの内容を読み込み、分析します。

**バックエンド (Laravel):**
- ディレクトリ一覧: `lara-next-reserve/laravel-next-app/database/migrations/`
- ディレクトリ一覧: `lara-next-reserve/laravel-next-app/app/Models/`
- ファイル読み込み: `lara-next-reserve/laravel-next-app/app/Models/User.php`
- ファイル読み込み: `lara-next-reserve/laravel-next-app/app/Models/Shop.php`
- ファイル読み込み: `lara-next-reserve/laravel-next-app/app/Models/Reservation.php`
- ファイル読み込み: `lara-next-reserve/laravel-next-app/app/Models/ReservationSlot.php`

**フロントエンド (Next.js):**
- ディレクトリ一覧: `lara-next-reserve/next-frontend-app/src/app/`

### ステップ3: UI/UXデザインの分析
視覚的およびユーザーエクスペリエンス要件を理解するために、以下のディレクトリにあるUIモックアップ画像を分析します。

- `lara-next-reserve/docs-private/yoyaku_ui/`

### ステップ4: ユーザーへの報告と開発開始の確認
上記ステップを実行後、その過程で実行できたこと（例：ファイルの読み込み成功）、できなかったこと（例：ツール・コマンドのエラー、ドキュメントとの差異発見）をユーザーに報告します。ユーザーが報告内容を確認し、開発開始の承認を得てから、次のタスクに着手してください。

## 3. 重要事項
- **日本語での対応**: ユーザーとのコミュニケーションは全て日本語で行います。特に指示がない限り、英語での応答は避けてください。

## 4. 想定される結論 (2026-01-16時点)
分析完了後、エージェントはプロジェクトのステータスについて以下の結論に達するはずです。

*   **バックエンド (フェーズ2: データベースとモデル定義) は完了**: 開発計画に従って、データベーススキーマ（マイグレーション）とEloquentモデルは完全に実装されています。複合ユニークキーや論理削除などの重要な機能が正しく配置されています。
*   **バックエンド (フェーズ3: 店舗機能APIの実装) は完了**: `ShopController`（検索機能を備えたindexおよびshowメソッド）とそれに対応するAPIルート（`GET /api/shops`、`GET /api/shops/{shop}`）は完全に実装されています。
*   **バックエンド (フェーズ4: 認証) は部分的に実装済み**: `/api/user` ルートは既に定義されており、`auth:sanctum` によって保護されています。
*   **フロントエンド (フェーズ3以降) は未着手**: Next.jsプロジェクトはまだ初期状態であり、カスタムページやコンポーネントは作成されていません。
*   **次のタスク**: 直近の次のステップは、**フェーズ4: 認証機能の実装**の継続であり、具体的にはLaravelプロジェクトの `routes/web.php` における `/login` および `/logout` ルートの実装です。

---
*このマニュアルは、`DEV_LOG.md`が更新されるたびに必要に応じて確認し、更新する必要があります。*