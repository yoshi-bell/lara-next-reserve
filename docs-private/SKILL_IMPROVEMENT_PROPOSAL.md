# Findy Skill Score Improvement Proposal

Findyのスキル偏差値（46.2）を向上させるための、即効性と本質的な改善を兼ねた提案です。

## 🔍 Analysis of Current Score Factors

現状のコードベース分析により、以下の点がスコア低下の要因となっている可能性があります：

1. **テストコード内の `any` 使用**: `useFavorite.test.ts` 等で SWR のモックに `any` が多用されている。
2. **コンパイラ設定の甘さ**: `strict: true` は設定されているが、`noUnusedLocals` や `noImplicitReturns` が未設定。
3. **フォーム実装の複雑度**: `ReservationForm` が `useState` で管理されており、分岐も多く、将来的な保守性が低い（Cyclomatic Complexityへの悪影響）。

## 🚀 Proposed Improvements

以下の3施策を提案します。

### Plan A: Eliminate 'any' in Tests (Priority: High)

テストコード内の `any` を排除し、適切な型定義（Generic Mocking）導入することで、型安全スコアを直接的に改善します。

- **Target**: `src/hooks/*.test.ts`
- **Action**: `vi.mocked()` の型引数を適切に設定し、`SWRMutationResponse` 型を完全に再現する。

### Plan B: Stricter TypeScript Configuration (Priority: High)

`tsconfig.json` をより厳格にし、未使用変数や暗黙の戻り値をエラー化します。これは静的解析ツールによるスコア判定に大きく寄与します。

- **Target**: `tsconfig.json`
- **Action**:
    ```json
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
    ```
- **Note**: これを有効にすると既存コードでエラーが出る可能性があるため、修正作業が必要です。

### Plan C: Modernize Form with React Hook Form (Priority: Medium)

`ReservationForm.tsx` を `react-hook-form` + `zod` (`@hookform/resolvers`) にリファクタリングします。

- **Target**: `src/components/ReservationForm.tsx`
- **Action**: 手動の `useState` 管理を廃止し、宣言的なバリデーション実装へ変更。

## 📅 Recommendation

**Plan B (設定厳格化)** を最初に実施し、プロジェクト全体の基準を引き上げた後、**Plan A (テスト修正)** で型安全性を固めるのが最も効率的です。

承認いただければ、まずは **Plan B** の適用とそれに伴う修正から開始します。
