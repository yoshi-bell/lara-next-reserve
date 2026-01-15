# Rese（飲食店予約サービス）

飲食店予約サービス「Rese」のフルスタックアプリケーションです。  
Laravel（バックエンド）とNext.js（フロントエンド）を完全に分離した構成で開発しています。

## 構成
- **backend**: Laravel 12 (Laravel Sail)
- **frontend**: Next.js (App Router, TypeScript, Tailwind CSS)


## セットアップ手順（簡易）

### バックエンド
```bash
cd laravel-next-app
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
```

### フロントエンド
```bash
cd next-frontend-app
npm install
npm run dev
```

## 主な機能
- ユーザー認証（Sanctum / Fortify）
- 店舗一覧・詳細表示・検索機能
- 予約機能（空席判定ロジック付き）
- お気に入り登録機能
- マイページ（予約管理・お気に入り一覧）
- 予約リマインダー（バッチ処理）
