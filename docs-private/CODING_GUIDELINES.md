# 🟢 メタ定義: このファイルの責務 (AIエージェント用)
> **AIエージェントへの指示 (Prompt Repetition Strategy):** 
> このファイルはプロジェクトの「詳細な実装ルール」を定義しています。
> 実装作業（コーディング、リファクタリング、レビュー）を行う際に読み込み、スタイルや規約を遵守してください。

*   **役割:** コーディング規約、コメント規則、命名規則、フレームワーク特有の実装パターンの定義。
*   **読むべきタイミング:** 実装タスク開始時、またはコードレビュー時。
*   **思考の優先順位:** `RULES_AND_ARCHITECTURE.md` の「憲法」に従いつつ、本書の「法律」を守る。

---

# lara-next-reserve コーディングガイドライン (Coding Guidelines)

## 🎨 実装ガイドライン (Implementation Guidelines)

### フロントエンド (Next.js / Tailwind CSS)
*   **自動整形:** `prettier-plugin-tailwindcss` を導入・適用し、クラス名の並び順を自動で統一すること。
*   **スタイリング:** モバイルファーストを徹底し、ユーティリティクラス (`className`) に直接記述する。`@apply` は原則禁止。
*   **コンポーネント設計:** 再利用可能なパーツはコンポーネント化し、単一責任の原則を守る。
*   **API通信:**
    *   エンドポイントは `src/services/endpoints.ts` で一元管理し、ハードコードしない。
    *   データ型は `src/types/index.ts` の共通型定義を使用する。

### バックエンド (Laravel)
*   **命名規則:** クラス名は `PascalCase`、メソッド・変数は `camelCase`、DBカラムは `snake_case` を厳守。
*   **クリーンコード:** コントローラーの責務を最小限に抑える（Thin Controller）。
    *   バリデーション → `FormRequest`
    *   ビジネスロジック・クエリ → `Service`
    *   レスポンス整形 → `JsonResource`

---

## 📝 コメント規則 (Commenting Rules)
コードの可読性と保守性を高めるため、以下のルールを遵守する。

### 1. 意図を語る (Intent over Implementation)
*   **悪い例:** コードを見れば分かることをそのまま書く。
    ```javascript
    // iを1増やす
    i++;
    ```
*   **良い例:** 「なぜ」その処理が必要なのか、背景や目的を書く。
    ```javascript
    // 配列の次の要素に移動するためにインデックスをインクリメント
    i++;
    ```

### 2. ドキュメンテーションコメント (DocBlocks)
*   公開メソッド（Service, Controller, Hooks）には、IDEの補完や他の開発者の理解を助けるために JSDoc / PHPDoc を記述する。
*   `@param`, `@return`, `@throws` などを活用し、入出力と例外を明確にする。

```php
/**
 * 指定された条件で店舗を検索する。
 * 
 * @param array $filters 検索条件（area_id, genre_id, name）
 * @return Collection 検索結果の店舗リスト
 */
public function getFilteredShops(array $filters): Collection
```

### 3. 特殊コメントタグ
実装上の注意点や技術的負債を明示するために、以下のタグを使用する。

*   `TODO:` 後で実装・修正が必要な箇所。
*   `FIXME:` 既知の不具合があり、修正が必要な箇所。
*   `WARNING:` 注意が必要な実装や、非推奨な使用法。
*   `NOTE:` 実装の背景や、一見奇妙に見えるコードの理由説明（重要）。

### 4. 自己文書化コード (Self-Documenting Code)
コメントを書く前に、まずコード自体を分かりやすくできないか検討する（Refactor First）。

*   **変数名:** `const d = 86400;` ではなく `const SECONDS_PER_DAY = 86400;` とする。
*   **関数抽出:** 複雑な条件式 (`if (x && y || z)`) は、意味のある名前の関数 (`if (isValidUser(user))`) に抽出する。

---

## 📂 ディレクトリ構造と責務 (Directory Structure)

### フロントエンド (`next-frontend-app/src`)
*   `app/`: Next.js App Router ページコンポーネント。
*   `components/`: UIコンポーネント（再利用可能）。
*   `hooks/`: ビジネスロジック、データフェッチ (SWR)。
*   `lib/`: 外部ライブラリの設定 (axiosなど)。
*   `services/`: APIエンドポイント定義 (`endpoints.ts`)。
*   `types/`: TypeScript型定義 (`index.ts`)。

### バックエンド (`laravel-next-app/app`)
*   `Http/Controllers/`: リクエスト受付とレスポンス返却。
*   `Http/Requests/`: バリデーションロジック。
*   `Http/Resources/`: APIレスポンス整形。
*   `Services/`: ビジネスロジック、クエリ構築。
*   `Models/`: Eloquentモデル、リレーション定義。

---

## 🏗️ 標準アーキテクチャ・パターン (Standard Patterns)
次回プロジェクト開発時にも適用すべき、推奨される実装パターン。

### 1. 型定義の自動同期 (Type Synchronization)
*   **ツール:** Backend: `knuckleswtf/scribe`, Frontend: `openapi-typescript`
*   **フロー:**
    1.  Laravelコードから `openapi.yaml` を自動生成。
    2.  `openapi.yaml` から TypeScript型定義 (`schema.d.ts`) を自動生成。
    3.  `schema.d.ts` を `src/types/index.ts` 等でラップして使用する。

### 2. データフェッチの抽象化 (Generic Data Fetching)
*   **パターン:** `useData<T>` (SWR Wrapper)
*   **目的:** `fetcher` 定義、レスポンスのアンラップ (`data.data`)、ローディング状態の管理を一元化する。
*   **実装:** `src/hooks/useData.ts` を作成し、全てのデータ取得Hooksはこれを利用する。

### 3. ランタイムバリデーション (Runtime Validation)
*   **ツール:** `zod`
*   **目的:** APIレスポンスやURLパラメータが、期待する型（OpenAPI定義）と一致しているか実行時に検証する。
*   **実装:**
    *   OpenAPI型定義に準拠した Zod スキーマを `src/lib/schemas.ts` に定義。
    *   `useData` フックにスキーマを渡し、データ取得時に `parse` する。

---

## 🧪 テスト実装ガイドライン (Testing Guidelines)

### 1. 型安全性の維持と妥協点
*   **原則:** テストコードにおいても `any` 型は極力排除し、`vi.Mock` や適切なインターフェースを使用して型安全性を保つ。これにより、リファクタリング時の影響範囲を正確に検知できるようにする。
*   **例外的な `any` の許容:** 
    *   SWR などの外部ライブラリの型定義が極めて複雑で、モックの型合わせに過大な工数を要する場合は、実務的な判断として `any` の使用を許容する。
    *   その際は、ファイル全体の `eslint-disable` ではなく、該当箇所のみ `// eslint-disable-next-line @typescript-eslint/no-explicit-any` を使用して、意図的な使用であることを明示する。
    *   **「型を完璧に合わせること」よりも「テストが網羅されていること」を優先する。**

### 2. 実行戦略 (E2E)
*   **フェーズ1:** `npx playwright test` による高速な並列実行。
*   **フェーズ2:** 並列実行で失敗したテストのみ、`--workers=1` オプションを付けて個別に直列検証し、バグか競合（Flaky）かを切り分ける。
