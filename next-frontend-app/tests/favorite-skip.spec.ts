import { test, expect } from "@playwright/test";

test.describe("お気に入り機能（スキップ設定）", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("user01@test.mail");
    await page.getByPlaceholder("Password").fill("usertest");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/");
  });

  test("お気に入り解除の確認スキップ設定が機能すること", async ({ page }) => {
    // 1. 準備: 1つお気に入りに入れておく
    const firstShopCard = page.getByTestId("shop-card").first();
    const shopName = await firstShopCard.locator("h2").innerText();
    const favoriteButton = firstShopCard.getByRole("button", { name: /お気に入り/ });
    
    // 初期化: 確実に「登録済み」の状態にする
    // もし未登録（「お気に入りに追加」）なら登録する
    if (await favoriteButton.getAttribute("aria-label") === "お気に入りに追加") {
        const createPromise = page.waitForResponse(res => 
            res.url().includes('/favorite') && res.request().method() === 'POST' && res.status() === 201
        );
        await favoriteButton.click();
        await createPromise;
        await expect(favoriteButton).toHaveAttribute("aria-label", "お気に入りから削除");
    } else {
        // 念のため状態確認
        await expect(favoriteButton).toHaveAttribute("aria-label", "お気に入りから削除");
    }

    // 2. マイページで設定をONにする
    await page.goto("/mypage");
    const skipCheckbox = page.getByLabel("お気に入り解除時の確認を省略");
    await skipCheckbox.check();

    // 3. 解除ボタンを押す（ダイアログが出ないことを期待）
    const deletePromise = page.waitForResponse(res => 
        res.url().includes('/favorite') && res.request().method() === 'DELETE' && res.status() === 200
    );
    const favCard = page.getByTestId("shop-card").filter({ hasText: shopName });
    
    // dialog ハンドラを登録せずにクリックし、リクエストが完了することを待つ
    // (もしダイアログが出たらPlaywrightは自動的にdismissするか停止するため、テストが失敗する)
    await favCard.getByRole("button", { name: "お気に入りから削除" }).click();
    await deletePromise;

    // 4. 消えたことを確認
    await expect(page.getByTestId("shop-card").filter({ hasText: shopName })).not.toBeVisible();
  });
});
