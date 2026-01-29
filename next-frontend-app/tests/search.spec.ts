import { test, expect } from "@playwright/test";

test.describe("店舗検索機能", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // テストデータ: エリアとその代表的な店舗
  const areas = [
    { name: "東京都", representative: "仙人" },
    { name: "大阪府", representative: "牛助" },
    { name: "福岡県", representative: "戦慄" },
  ];

  // データ駆動テスト: 各エリアについて検証
  areas.forEach((targetArea) => {
    test(`エリア「${targetArea.name}」で絞り込みができること`, async ({ page }) => {
      // エリア選択
      const areaSelect = page.locator('select').filter({ hasText: 'All area' });
      
      // APIレスポンスを待機（SWRの更新完了を待つ）
      const responsePromise = page.waitForResponse(resp => 
        resp.url().includes('/api/shops') && resp.status() === 200
      );
      await areaSelect.selectOption({ label: targetArea.name });
      await responsePromise;

      // 1. 選択したエリアの代表店舗が表示されていること
      await expect(page.getByText(targetArea.representative)).toBeVisible();

      // 2. 選択していない他のエリアの代表店舗が表示されていないこと
      const otherAreas = areas.filter(a => a.name !== targetArea.name);
      for (const otherArea of otherAreas) {
        await expect(page.getByText(otherArea.representative)).not.toBeVisible();
      }
    });
  });

  // テストデータ: ジャンルとその代表的な店舗
  const genres = [
    { name: "寿司", representative: "仙人" },
    { name: "焼肉", representative: "牛助" },
    { name: "居酒屋", representative: "戦慄" },
    { name: "イタリアン", representative: "ルーク" },
    { name: "ラーメン", representative: "志摩屋" },
  ];

  // データ駆動テスト: 各ジャンルについて検証
  genres.forEach((targetGenre) => {
    test(`ジャンル「${targetGenre.name}」で絞り込みができること`, async ({ page }) => {
      const genreSelect = page.locator('select').filter({ hasText: 'All genre' });
      
      // APIレスポンスを待機
      const responsePromise = page.waitForResponse(resp => 
        resp.url().includes('/api/shops') && resp.status() === 200
      );
      await genreSelect.selectOption({ label: targetGenre.name });
      await responsePromise;

      // 1. 選択したジャンルの代表店舗が表示されていること
      await expect(page.getByText(targetGenre.representative)).toBeVisible();

      // 2. 選択していない他のジャンルの代表店舗が表示されていないこと
      const otherGenres = genres.filter(g => g.name !== targetGenre.name);
      for (const otherGenre of otherGenres) {
        await expect(page.getByText(otherGenre.representative)).not.toBeVisible();
      }
    });
  });

  test("店名検索ができること", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search ...");
    
    // APIレスポンスを待機
    const responsePromise = page.waitForResponse(resp => 
      resp.url().includes('/api/shops') && resp.status() === 200
    );
    await searchInput.fill("仙人");
    await responsePromise;

    // "仙人" は表示
    await expect(page.getByText("仙人")).toBeVisible();

    // "牛助" は非表示
    await expect(page.getByText("牛助")).not.toBeVisible();
  });

  test("エリア・ジャンル・キーワードの複合検索ができること", async ({ page }) => {
    // 条件設定: 東京都 × 寿司 × キーワード"仙"
    // 複数の操作を行うため、最後の操作（fill）でレスポンスを待つ
    await page.locator('select').filter({ hasText: 'All area' }).selectOption({ label: "東京都" });
    await page.locator('select').filter({ hasText: 'All genre' }).selectOption({ label: "寿司" });
    
    const responsePromise = page.waitForResponse(resp => 
      resp.url().includes('/api/shops') && resp.status() === 200
    );
    await page.getByPlaceholder("Search ...").fill("仙");
    await responsePromise;

    // 1. 全ての条件に一致する店舗が表示されていること
    await expect(page.getByText("仙人")).toBeVisible();

    // 2. 一部の条件だけ一致する店舗が非表示であること
    // 東京都だが寿司ではない
    await expect(page.getByText("ルーク")).not.toBeVisible();
    // 寿司だが東京都ではない
    await expect(page.getByText("福助")).not.toBeVisible();
    // キーワードが一致しない
    await expect(page.getByText("築地色合")).not.toBeVisible();
  });
});
