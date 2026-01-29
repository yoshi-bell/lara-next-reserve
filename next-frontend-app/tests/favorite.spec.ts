import { test, expect } from "@playwright/test";

test.describe("お気に入り機能", () => {
    // 共通処理: ログイン
    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        await page.goto("/login");
        await page.getByPlaceholder("Email").fill("user01@test.mail");
        await page.getByPlaceholder("Password").fill("usertest");
        await page.getByRole("button", { name: "ログイン" }).click();
        await expect(page).toHaveURL("/");
    });

    test("店舗のお気に入り登録から解除までの一連のフロー", async ({ page }) => {
        // 1. 最初の店舗の名前を取得
        const firstShopCard = page.getByTestId("shop-card").first();
        const shopName = await firstShopCard.locator("h2").innerText();

        // DBリセット直後なので「お気に入りに追加」ボタンのはず
        const favoriteButton = firstShopCard.getByRole("button", {
            name: /お気に入り/,
        });

        // 初期化: もし登録済みなら解除してクリーンな状態にする
        if (
            (await favoriteButton.getAttribute("aria-label")) ===
            "お気に入りから削除"
        ) {
            const deletePromise = page.waitForResponse(
                (response) =>
                    response.url().includes("/favorite") &&
                    response.request().method() === "DELETE" &&
                    response.status() === 200,
            );
            await favoriteButton.click();
            await deletePromise;
            await expect(favoriteButton).toHaveAttribute(
                "aria-label",
                "お気に入りに追加",
            );
        }

        // 2. 登録実行
        const createPromise = page.waitForResponse(
            (response) =>
                response.url().includes("/favorite") &&
                response.request().method() === "POST" &&
                response.status() === 201,
        );
        await favoriteButton.click();
        await createPromise;

        // ボタンが「削除」に変わることを確認
        // ※クリック後に要素が再レンダリングされるため、再度取得または待機が必要だが、
        // aria-labelが変わるのを待つことで検証になる
        await expect(firstShopCard.getByRole("button")).toHaveAttribute(
            "aria-label",
            "お気に入りから削除",
        );

        // 3. マイページでの表示確認
        await page.goto("/mypage");
        // マイページのお気に入りカード
        const favCard = page
            .getByTestId("shop-card")
            .filter({ hasText: shopName });
        await expect(favCard).toBeVisible();

        // 4. マイページから解除（確認ダイアログあり）
        page.once("dialog", (dialog) => {
            expect(dialog.message()).toContain("お気に入りを解除しますか？");
            dialog.accept();
        });

        const deletePromise = page.waitForResponse(
            (response) =>
                response.url().includes("/favorite") &&
                response.request().method() === "DELETE" &&
                response.status() === 200,
        );

        // マイページの削除ボタンをクリック
        await favCard
            .getByRole("button", { name: "お気に入りから削除" })
            .click();
        await deletePromise;

        // 消えたことを確認
        // 予約リストにも同じ店舗名が含まれる可能性があるため、お気に入りカード単位で存在確認する
        await expect(
            page.getByTestId("shop-card").filter({ hasText: shopName }),
        ).not.toBeVisible();
    });
});
