# 教材との相違点まとめ (DIFFERENCES.md)

このドキュメントは、参考にしている教材（Laravel x Next.js チュートリアル）の手順と、当プロジェクト「Rese」で実際に採用する手法の相違点を記録したものです。

## 1. 認証方式 (Authentication)

| 項目 | 教材の手法 | 当プロジェクトの採用方針 | 理由 |
| :--- | :--- | :--- | :--- |
| **ベース** | NextAuth.js + Sanctum | NextAuth.js + Sanctum + **Breeze API** | Breeze (API) を導入することで、堅牢な認証ロジックを自動生成しつつ可視化するため。 |
| **フロー** | 手動でのCookieリレー | 同左（教材準拠） | 教材の高度な連携手法を学習するため。 |

## 2. API通信 (Data Fetching)

| 項目 | 教材の手法 | 当プロジェクトの採用方針 | 理由 |
| :--- | :--- | :--- | :--- |
| **Server Components** | `fetch` API | `fetch` API | Next.js標準のキャッシュ・最適化機能を活用するため。 |
| **Client Components** | `useSWR` (Axios想定?) | `useSWR` + **Axios** | SanctumのCSRF保護やCookie管理において、Axiosの方がプラグイン等で簡潔に記述できるため。 |

## 3. ディレクトリ構成と設計 (Project Structure)

| 項目 | 教材の手法 | 当プロジェクトの採用方針 | 理由 |
| :--- | :--- | :--- | :--- |
| **コンポーネント** | `page.tsx` 内に全て記述 | `src/components/` に分離 | 再利用性を高め、`page.tsx` をシンプルに保つため。 |
| **型定義 (Types)** | `page.tsx` 内に `interface` 記述 | `src/types/` に分離管理 | 複数ページで型を共有し、保守性を高めるため。 |

## 4. スタイリング (Tailwind CSS)

| 項目 | 教材の手法 | 当プロジェクトの採用方針 | 理由 |
| :--- | :--- | :--- | :--- |
| **クラス管理** | `@apply` を使用したクラス作成 | **`@apply` 禁止**、Reactコンポーネント化 | Tailwindの利点（HTMLで完結）を活かしつつ、Reactのコンポーネント指向で共通化するため。 |
| **自動整形** | （特になし） | `prettier-plugin-tailwindcss` 導入 | クラス名の並び順を自動統一し、コード品質を均一化するため。 |

## 5. 開発環境 (Infrastructure)

| 項目 | 教材の手法 | 当プロジェクトの採用方針 | 理由 |
| :--- | :--- | :--- | :--- |
| **DB管理** | Sail標準 (GUIなし想定) | **phpMyAdmin** の追加 | 開発初期のデータ投入確認を容易にするため。 |
| **メール確認** | Mailpit | Mailpit | 教材（およびSail標準）に合わせつつ、受信確認を確実に行うため。 |
