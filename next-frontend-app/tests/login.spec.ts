import { test, expect } from "@playwright/test";

test.describe("ログイン機能", () => {
  // 各テストの前にログインページにアクセス
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("正しい認証情報でログインできること", async ({ page }) => {
    // 1. フォームを入力 (placeholderを利用)
    await page.getByPlaceholder("Email").fill("user01@test.mail");
    await page.getByPlaceholder("Password").fill("usertest");

    // 2. ログインボタンをクリック
    await page.getByRole("button", { name: "ログイン" }).click();

    // 3. ホームページにリダイレクトされたことを確認
    await expect(page).toHaveURL("/");

    // 4. ユーザー名が表示されていることを確認
    // ヘッダーにユーザー名が表示される実装になっているはずなので、そのテキストを探す
    await expect(page.getByText("テストユーザー1")).toBeVisible();
  });

  test("間違った認証情報ではログインできないこと", async ({ page }) => {
    // 1. 間違った情報を入力
    await page.getByPlaceholder("Email").fill("wrong@test.mail");
    await page.getByPlaceholder("Password").fill("wrongpassword");

    // 2. ログインボタンをクリック
    await page.getByRole("button", { name: "ログイン" }).click();

    // 3. エラーメッセージが表示されることを確認
    // 以前のセッションで「メールアドレスまたはパスワードが正しくありません。」に日本語化したメッセージを検証
    await expect(page.getByText("メールアドレスまたはパスワードが正しくありません。")).toBeVisible();

    // 4. ログインページに留まっていることを確認
    await expect(page).toHaveURL("/login");
  });
});
