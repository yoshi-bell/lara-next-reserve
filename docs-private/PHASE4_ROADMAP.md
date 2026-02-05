# Phase 4 Refactoring Roadmap: Expert TypeScript

Findy等のスキル偏差値を最大化するための、高度なTypeScript/Reactリファクタリング（フェーズ4）の実装計画です。

## 📅 Roadmap Overview

| Step    | Task Name                        | Description                                                               | Priority |
| :------ | :------------------------------- | :------------------------------------------------------------------------ | :------- |
| **4-1** | **Branded Types Implementation** | ID型を`number`から`Brand<T, 'Tag'>`へ変更し、型安全性を強化する。         | High     |
| **4-2** | **Zod Schema Inference**         | `types/index.ts`の手動定義を廃止し、Zodスキーマからの型推論に切り替える。 | High     |
| **4-3** | **Polymorphic Components**       | `as` propsを受け取る汎用コンポーネントを作成し、再利用性を高める。        | Medium   |

---

## 📝 Detailed Implementation Plan & File List

### 4-1. Branded Types (Nominal Typing)

プリミティブな `number` 型のIDを、意味のある単位（`UserId`, `ShopId`等）で区別可能な型定義に変更します。

#### 📋 Modify List

- **[MODIFY]** `next-frontend-app/src/types/index.ts`
    - `Brand` ユーティリティ型の定義を追加。
    - `UserId`, `ShopId`, `AreaId`, `GenreId`, `ReservationId` 型を定義。
    - 各インターフェース（`User`, `Shop`など）の `id` プロパティの型を上記Branded Typeに変更。
- **[MODIFY]** `next-frontend-app/src/lib/schemas.ts`
    - Zodスキーマ定義においても `.brand()` を使用し、推論結果がBranded Typeになるように修正。
- **[CHECK]** `next-frontend-app/src/hooks/useShops.ts`
    - IDを受け渡す箇所で型の不整合が起きないか確認・修正。
- **[CHECK]** `next-frontend-app/src/components/ShopCard.tsx`
    - Propsの型定義（`Pick<Shop, ...>`）は自動追従するはずだが、ID比較ロジックなどを確認。

### 4-2. Single Source of Truth (Zod Schema Inference)

型定義とバリデーションロジックの二重管理を解消します。

#### 📋 Modify List

- **[MODIFY]** `next-frontend-app/src/types/index.ts`
    - 既存の `interface Area`, `interface Shop` 等の定義を削除。
    - `@/lib/schemas` からスキーマをインポート。
    - `export type Area = z.infer<typeof areaSchema>;` の形式書き換え。
- **[CHECK]** `next-frontend-app/src/hooks/useData.ts`
    - ジェネリクス `T` と Zodスキーマの整合性が保たれているか確認。

### 4-3. Polymorphic Components (as props pattern)

「タグを動的に変更できる」高度なReactコンポーネントを作成します。

#### 📋 Modify List

- **[NEW]** `next-frontend-app/src/components/ui/Typography.tsx` (または `Box.tsx`)
    - Genericsと`React.ElementType`を使用したPolymorphicコンポーネントの実装。
- **[MODIFY]** `next-frontend-app/src/components/ShopCard.tsx`
    - 既存の `h2` や `span` タグの一部を、作成した `Typography` コンポーネントに置き換えて動作検証。
- **[MODIFY]** `next-frontend-app/src/components/Header.tsx`
    - ナビゲーションリンク等で試験的に導入。
