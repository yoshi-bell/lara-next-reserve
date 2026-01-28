# 第2章: E2Eテスト

## 1. E2E（End-to-End）テストとは
アプリケーション全体を、実際のユーザーと同じように操作して、一連の機能が正しく連携して動作するかを検証するテスト。「端から端まで（フロントエンドからデータベースまで）」を貫通して検証する。

### 目的
*   **主要なユーザーフローの保証:** ログイン、購入、投稿など、ビジネス上の最重要パスが完結することを保証する。
*   **デプロイ前の最終確認:** アプリケーション全体の健全性を確認する「最後の砦」。
*   **広範囲なリグレッション検出:** 各層の変更が他層に与える予期せぬ影響を検知する。

## 2. E2Eテスト vs ユニットテスト

| 観点 | E2Eテスト | ユニットテスト |
| :--- | :--- | :--- |
| **スコープ** | アプリケーション全体 | 関数やコンポーネント単体 |
| **視点** | ユーザー（ブラックボックス） | 開発者（ホワイトボックス） |
| **実行環境** | 実際のブラウザ | Node.js / 仮想DOM |
| **実行速度** | 遅い | 速い |
| **信頼性** | 高い（実環境に近い） | 低い（モック依存が多い） |

※E2Eテストはコストが高いため、**「数は絞り、コアなユーザーストーリーに焦点を当てる」** のが一般的。

## 3. テストシナリオの考え方
「ユーザーが何を達成したいのか」というストーリーに基づいて記述する。

### 例：認証フロー
1.  トップページへアクセス。
2.  ログインボタンをクリック。
3.  有効な認証情報を入力・送信。
4.  ダッシュボードへ遷移し、歓迎メッセージを確認。
5.  ログアウトし、ログインボタンの再出現を確認。

---

## 4. Playwright の概要
Microsoftが開発するモダンなE2Eテストフレームワーク。

### 主な特徴
*   **クロスブラウザ対応:** Chromium, Firefox, WebKit すべてをサポート。
*   **自動待機 (Auto-wait):** 要素が表示・操作可能になるまで自動で待機するため、テストが安定する。
*   **Codegen (テスト生成):** ブラウザ上の操作を記録し、自動でテストコードを生成できる。
*   **豊富なツール:** ビデオ録画、ネットワークモック、HTMLレポート生成などが標準搭載。

## 5. セットアップと基本概念
### セットアップ
```bash
npm init playwright@latest
```

### 主要なAPI
*   **`test`**: テストケースの定義。
*   **`page`**: ブラウザのタブ操作（`goto`, `click` など）。
*   **`locator`**: 要素の特定。自動待機の中心機能。
*   **`expect`**: アサーション（`.toHaveText`, `.toBeVisible` など）。

### コード例
```typescript
import { test, expect } from "@playwright/test";

test("ホームページの検証", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  const title = page.locator(".navbar__title");
  await expect(title).toHaveText("Playwright");
});
```

## 6. Playwright Codegen (テスト自動生成)
ブラウザ操作をリアルタイムでコードに変換する強力な機能。
```bash
npx playwright codegen [URL]
```
生成されたコードをコピー＆ペーストすることで、複雑な操作のテスト作成を大幅に効率化できる。

## 7. テストの実行とレポート
*   **実行:** `npx playwright test`
*   **レポート表示:** `npx playwright show-report`

---

## 8. ハンズオン: ログインフォームのテスト
実際のNext.jsアプリケーションに対して、ログインの成功・失敗シナリオを実装する。

### 堅牢なロケーターの選択
CSSセレクタではなく、ユーザーの視点に近い「セマンティックなロケーター」を使用することが推奨される。

*   **`getByLabel("ラベル名")`**: ラベルテキストに関連付けられた入力フォームを特定。
*   **`getByRole("役割", { name: "名前" })`**: ボタンやリンクなどの役割と表示名で特定。
    *   例：`page.getByRole("button", { name: "ログイン" })`

### テストコードの例 (`tests/login.spec.ts`)
```typescript
test.describe("ログイン機能", () => {
  // 各テスト前の共通処理
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });

  test("正しい情報でログインできる", async ({ page }) => {
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByLabel("パスワード").fill("password");
    await page.getByRole("button", { name: "ログイン" }).click();

    await expect(page).toHaveURL("http://localhost:3000/"); // 遷移先の検証
    await expect(page.getByText("ようこそ")).toBeVisible(); // 表示の検証
  });
});
```

### 実行時の注意点
*   **サーバーの起動:** E2Eテストは実稼働中のアプリに対して行うため、バックエンド(Sail)とフロントエンド(npm run dev)の両方が起動している必要がある。
*   **視覚的確認:** `--headed` フラグを付けると、実際にブラウザが動作する様子を確認できる。

---
**✨ まとめ:**
Playwrightは高い信頼性と開発効率を両立したツールである。特に `auto-wait` と `codegen` は、不安定になりがちなE2Eテストの課題を解決する強力な武器となる。
ハンズオンでは、`test.beforeEach` による準備の共通化や、`getByRole` 等のセマンティックなロケーターを活用することで、変更に強く信頼性の高いE2Eテストを構築する手法を学んだ。