import { test, expect } from "@playwright/test";

test.describe("ログアウト機能", () => {
  test.beforeEach(async ({ page, context }) => {
    // 1. ログイン済みの状態を作る
    await context.clearCookies();
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("user01@test.mail");
    await page.getByPlaceholder("Password").fill("usertest");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/");
  });

  test("ログアウトして未ログイン状態に戻れること", async ({ page }) => {
    // 2. ハンバーガーメニューを開く
    // ヘッダー内の最初のボタンがメニューボタン
    await page.locator('header button').first().click();

    // 3. Logout ボタンをクリック
    // メニュー内の Logout テキストを持つボタンを探す
    const logoutButton = page.getByRole("button", { name: "Logout" });
    await expect(logoutButton).toBeVisible();
    
    // APIレスポンスを待機 (POST /api/logout)
    const logoutResponse = page.waitForResponse(res => 
        res.url().includes('/logout') && res.status() === 204
    );
    await logoutButton.click();
    await logoutResponse;

    // 4. トップページへリダイレクトされ、未ログイン状態のメニューが表示されること
    await expect(page).toHaveURL("/");
    
    // メニューを再度開いて、Registration / Login が表示されているか確認
    await page.locator('header button').first().click();
    await expect(page.getByRole("link", { name: "Registration" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    
    // Logoutボタンが消えていることを確認
    await expect(page.getByRole("button", { name: "Logout" })).not.toBeVisible();
  });
});
