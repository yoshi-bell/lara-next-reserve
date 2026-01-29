import { test, expect } from "@playwright/test";

/**
 * お気に入り機能の統合テスト（直列実行版）
 * .serial を使用することで、同じユーザーでの同時操作による競合を防ぎます。
 */
test.describe.serial("お気に入り機能（統合・直列実行）", () => {
    let shopName: string;

    test.beforeEach(async ({ page, context }) => {
        // クリーンな状態でログイン
        await context.clearCookies();
        await page.goto("/login");
        await page.getByPlaceholder("Email").fill("user01@test.mail");
        await page.getByPlaceholder("Password").fill("usertest");
        await page.getByRole("button", { name: "ログイン" }).click();
        await expect(page).toHaveURL("/");

        // 最初の店舗名を取得
        const firstShopCard = page.getByTestId("shop-card").first();
        shopName = await firstShopCard.locator("h2").innerText();
    });

    test("1. トップページで登録し、マイページで解除できること", async ({ page }) => {
        const firstShopCard = page.getByTestId("shop-card").first();
        const favoriteButton = firstShopCard.getByRole("button", { name: /お気に入り/ });

        // 初期化: もし登録済みなら解除（念のため）
        if (await favoriteButton.getAttribute("aria-label") === "お気に入りから削除") {
            const deletePromise = page.waitForResponse(res => res.request().method() === 'DELETE' && res.status() === 200);
            await favoriteButton.click();
            await deletePromise;
        }

        // 登録実行
        const createPromise = page.waitForResponse(res => res.request().method() === 'POST' && res.status() === 201);
        await favoriteButton.click();
        await createPromise;
        await expect(favoriteButton).toHaveAttribute("aria-label", "お気に入りから削除");

        // マイページで確認と解除
        await page.goto("/mypage");
        const favCard = page.getByTestId("shop-card").filter({ hasText: shopName });
        await expect(favCard).toBeVisible();

        page.once("dialog", d => d.accept());
        const deletePromise = page.waitForResponse(res => res.request().method() === 'DELETE' && res.status() === 200);
        await favCard.getByRole("button", { name: "お気に入りから削除" }).click();
        await deletePromise;

        // 消滅確認
        await expect(page.getByTestId("shop-card").filter({ hasText: shopName })).not.toBeVisible();
    });

    test("2. お気に入り解除の確認スキップ設定が機能すること", async ({ page }) => {
        const firstShopCard = page.getByTestId("shop-card").first();
        const favoriteButton = firstShopCard.getByRole("button", { name: /お気に入り/ });

        // 準備: 登録済み状態にする
        if (await favoriteButton.getAttribute("aria-label") === "お気に入りに追加") {
            const createPromise = page.waitForResponse(res => res.request().method() === 'POST' && res.status() === 201);
            await favoriteButton.click();
            await createPromise;
        }

        // マイページで設定ON
        await page.goto("/mypage");
        const skipCheckbox = page.getByLabel("お気に入り解除時の確認を省略");
        await skipCheckbox.check();

        // 解除実行（ダイアログが出ないことを期待）
        const deletePromise = page.waitForResponse(res => res.request().method() === 'DELETE' && res.status() === 200);
        const favCard = page.getByTestId("shop-card").filter({ hasText: shopName });
        await favCard.getByRole("button", { name: "お気に入りから削除" }).click();
        await deletePromise;

        // 消滅確認
        await expect(page.getByTestId("shop-card").filter({ hasText: shopName })).not.toBeVisible();
    });
});
