# Rese 開発計画書 (DEVELOPMENT_PLAN.md)

## 1. 設計概念 (Core Concepts)

### アーキテクチャ
*   **完全分離構成:** フロントエンド (Next.js) と バックエンド (Laravel API) を疎結合にする。
*   **ステートフル認証:** SPA認証には Laravel Sanctum (Cookie-based Session) を採用する。

### 開発方針
*   **機能優先 (Function First):** UIの装飾よりも、データの正確な流れと機能の実装を最優先する。
*   **画面逆算設計 (UI-Driven API):** APIのエンドポイントやレスポンス構造は、画面に必要なデータから逆算して決定する。
*   **堅牢性:** データベースレベルでの制約（複合ユニークキー等）を活用し、データの整合性を担保する。

---

## 2. 重要事項 (Critical Points)

### データベース
*   **複合ユニーク制約:** `reservations` テーブルの `(user_id, date, time)` および `favorites` テーブルの `(user_id, shop_id)` には必ず設定する。
*   **論理削除:** 予約キャンセルは `deleted_at` (SoftDeletes) を使用し、履歴を残す。

### バリデーション
*   **重複予約防止:** DBのユニーク制約に加え、FormRequestクラスで「時間の重複（開始〜終了時間が被る予約）」をチェックするロジックを実装する。

### 非同期処理
*   **リアルタイム性:** 検索フォーム、お気に入り登録、予約空席確認は、画面遷移を伴わない非同期通信 (Axios / SWR) で実装する。

---

## 3. ロードマップ (Roadmap)

### Phase 1: 基盤構築と設計（完了）
*   プロジェクト作成 (Laravel + Next.js)
*   データベース設計・機能要件定義
*   Gitリポジトリ初期化

### Phase 2: データベースとAPIの土台作成
*   マイグレーションファイルの作成・実行
*   モデル・リレーション定義
*   初期データ投入 (Seeder)

### Phase 3: 店舗機能の実装 (公開エリア)
*   店舗一覧API & 画面
*   店舗検索機能 (エリア・ジャンル・店名)
*   店舗詳細API & 画面

### Phase 4: 認証機能の実装
*   Laravel Fortify / Sanctum のセットアップ
*   会員登録・ログイン・ログアウト画面と連携

### Phase 5: 予約・お気に入り機能の実装 (要ログイン)
*   お気に入り登録機能
*   予約空席判定ロジック
*   予約実行機能
*   マイページ (予約一覧・キャンセル・お気に入り一覧)

### Phase 6: 仕上げと拡張
*   予約リマインダーメール (バッチ処理)
*   README整備、デプロイ準備

---

## 4. タスク一覧 (Tasks)

### Phase 2: データベース構築
- [ ] `users` テーブルマイグレーション修正 (電話番号等追加)
- [ ] `shops` テーブルマイグレーション作成
- [ ] `areas`, `genres` テーブルマイグレーション作成
- [ ] `reservations` テーブルマイグレーション作成 (複合ユニーク設定)
- [ ] `favorites` テーブルマイグレーション作成
- [ ] 全モデル作成とリレーションメソッド (`hasMany`, `belongsTo`) 実装
- [ ] ダミーデータ (Factory/Seeder) 作成と投入

### Phase 3: 店舗機能
- [ ] `ShopController` 作成 (index, show)
- [ ] `GET /api/shops` 実装 (検索クエリ対応)
- [ ] `GET /api/shops/{id}` 実装
- [ ] Next.js: 店舗一覧ページ実装 (`useSWR` 利用)
- [ ] Next.js: 検索フィルター実装
- [ ] Next.js: 店舗詳細ページ実装

### Phase 4: 認証機能
- [ ] Laravel: `fortify`, `sanctum` インストール・設定
- [ ] Laravel: 認証用ルートの定義
- [ ] Next.js: 登録 (`/register`)・ログイン (`/login`) ページ実装
- [ ] Next.js: 認証フック (`useAuth`) の実装

### Phase 5: 予約・お気に入り
- [ ] `FavoriteController` 作成 (toggle機能)
- [ ] `ReservationController` 作成
- [ ] 予約空席チェックAPI (`POST /api/reservations/check`) 実装
- [ ] 予約登録API (`POST /api/reservations`) 実装 (バリデーション強化)
- [ ] Next.js: 予約フォームコンポーネント実装
- [ ] Next.js: マイページ (`/mypage`) 実装

### Phase 6: その他
- [ ] メール通知クラス (`Mailable`) 作成
- [ ] スケジューラー設定 (リマインダーメール)
