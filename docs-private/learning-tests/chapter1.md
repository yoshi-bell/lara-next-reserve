# 第1章: Vitestの基本

## 1. Vitestの概要
VitestはViteベースの高速なテストフレームワークであり、Next.js（Vite環境）と非常に相性が良い。

### 主な特徴
*   **高速な実行:** ViteのHMR（ホットモジュールリプレイスメント）を利用し、変更箇所のテストのみを即座に再実行する。
*   **シンプルな設定:** `vite.config.ts` を共有できるため、複雑な設定が不要。
*   **Jest互換:** JestとおなじみのAPI（describe, it, expect）を提供しており、移行が容易。

## 2. 基本API
Vitestでテストを書く際に核となる3つのグローバル関数。

| 関数 | 役割 |
| :--- | :--- |
| `describe(name, factory)` | 関連する複数のテストをグループ化する。 |
| `it(name, factory)` | 個々のテストケース（仕様）を定義する。`test` はエイリアス。 |
| `expect(value)` | アサーション（値が期待通りであることの表明）を開始する。 |

## 3. 主要なマッチャー (Matcher)
`expect()` で返された値を検証するためのメソッド。

*   `.toBe(value)`: プリミティブ値の厳密な等価性（`===`）を検証。
*   `.toEqual(value)`: オブジェクトや配列の再帰的な等価性を検証。
*   `.toBeTruthy()` / `.toBeFalsy()`: 真偽値の検証。
*   `.toContain(item)`: 配列や文字列に特定の要素が含まれているか検証。
*   `.toThrow()`: 例外がスローされるか検証。

## 4. テストの実装手順 (純粋関数)
1.  **テスト対象の作成:** 例：`src/utils/math.ts`
2.  **テストファイルの作成:** 対象ファイルと同じ階層に `.test.ts` または `.spec.ts` を作成。
3.  **アサーションの記述:** `expect(関数(引数)).toBe(期待値)` の形式で記述。
4.  **テストの実行:** `package.json` に `"test": "vitest"` を追加し、`npm test` を実行。

---

## 5. ハンズオン: カスタムフックのテスト
Reactの状態 (useState) や副作用 (useEffect) を持つカスタムフックをテストするには、`@testing-library/react` を使用する。

### 必要なセットアップ
1.  **インストール:**
    ```bash
    npm install -D @testing-library/react jsdom @testing-library/jest-dom
    ```
2.  **設定ファイル (`vitest.config.ts`):**
    *   `environment: "jsdom"` を指定（仮想DOM環境）。
    *   `setupFiles: "./vitest.setup.ts"` を指定。
3.  **セットアップファイル (`vitest.setup.ts`):**
    *   `import "@testing-library/jest-dom";` を記述し、DOM用カスタムマッチャーを有効化。

### フックのテスト実装 (`renderHook` と `act`)

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("incrementを呼ぶとcountが増える", () => {
  // 1. フックをレンダリング (renderHook)
  const { result } = renderHook(() => useCounter(0));

  // 2. 状態更新処理は act() でラップする
  act(() => {
    result.current.increment();
  });

  // 3. 結果の検証 (result.current)
  expect(result.current.count).toBe(1);
});
```

### 重要なポイント
*   **`renderHook`:** フックはコンポーネント内でのみ動作するため、テスト用の仮想コンポーネントを作成してフックを実行してくれる関数。
*   **`result.current`:** フックの最新の戻り値（stateや関数）にアクセスするためのプロパティ。
*   **`act`:** Reactの状態更新（useStateなど）を伴う処理をラップする関数。これが完了するまでテストの実行を待機させ、DOMへの反映を保証する。

---
**✨ まとめ:**
VitestとTesting Libraryを組み合わせることで、純粋関数だけでなくReact特有のフックも単体テストが可能になる。特に `act` による状態更新の待機と、`renderHook` による仮想レンダリングが重要である。