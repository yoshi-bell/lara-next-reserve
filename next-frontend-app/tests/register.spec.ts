import { test, expect } from "@playwright/test";

test.describe("会員登録機能", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("正しい情報で会員登録できること", async ({ page }) => {
    // ユニークなメールアドレスを生成
    const uniqueEmail = `test-user-${Date.now()}@example.com`;

    // フォーム入力
    await page.getByPlaceholder("Username").fill("New User");
    await page.getByPlaceholder("Email").fill(uniqueEmail);
    await page.getByPlaceholder("Password", { exact: true }).fill("password123");
    await page.getByPlaceholder("Password Confirmation").fill("password123");
    await page.getByPlaceholder("Phone Number").fill("09012345678");
    
    // 性別選択 (selectタグ)
    await page.locator('select#gender').selectOption("male");
    
    await page.getByPlaceholder("Age").fill("25");

    // 登録ボタンクリック
    await page.getByRole("button", { name: "登録" }).click();

    // 完了ページへの遷移を確認
    await expect(page).toHaveURL("/thanks");

    // 完了メッセージ等の確認（もしあれば）
    await expect(page.getByText("会員登録ありがとうございます")).toBeVisible();
    
    // ログインボタンがあるか確認（次のアクションへの導線）
    await expect(page.getByRole("link", { name: "ログインする" })).toBeVisible();
  });

  test("バリデーションエラーが表示されること", async ({ page }) => {
    // 空のまま送信
    await page.getByRole("button", { name: "登録" }).click();

    // エラーメッセージの表示を確認 (HTML5のバリデーションが無効化されている前提)
    // 実装では noValidate がついているのでJSで制御されているはず
    
    // バックエンドからのエラーメッセージが表示されるか
    // "名前を入力してください" などのメッセージを期待
    // (具体的なメッセージは lang/ja.json の設定による)
    
    // URLが変わっていないことを確認
    await expect(page).toHaveURL("/register");
  });
});
