import { test, expect } from "@playwright/test";

// 共通処理: ログイン
test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("user01@test.mail");
  await page.getByPlaceholder("Password").fill("usertest");
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL("/");
});

test("予約の作成とキャンセルができること", async ({ page }) => {
  // --- 1. 準備: 日付データの生成 ---
  // ReservationSeederは2週間先までしか予約を作らないため、20日後は空いているはず
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 20);
  const dateString = targetDate.toISOString().split("T")[0];
  // 画面表示用（ja-JPの挙動に合わせてゼロ埋めなしの YYYY/M/D 形式を作成）
  const displayDate = `${targetDate.getFullYear()}/${targetDate.getMonth() + 1}/${targetDate.getDate()}`;

  // --- 2. 予約の作成 ---
  // 店舗一覧の最初の店舗へ遷移
  await page.getByRole("link", { name: "詳しくみる" }).first().click();
  
  // 日付入力
  // input[type="date"] を明示的に指定
  await page.locator('input[type="date"]').fill(dateString);
  
  // 検証: 入力値の反映確認
  await expect(page.getByText(dateString)).toBeVisible();
  
  // 時間と人数の選択
  await page.locator('select').filter({ hasText: '時間を選択してください' }).selectOption("18:00");
  await page.locator('select').filter({ hasText: '1人' }).selectOption("2");

  // 予約実行
  await page.getByRole("button", { name: "予約する" }).click();

  // バリデーションエラーが出ていないことを確認
  await expect(page.getByText("予約日時は現在時刻より後の時間を指定してください。")).not.toBeVisible();

  // 検証: 完了画面への遷移
  await expect(page).toHaveURL(/\/done$/);

  // 戻る
  await page.getByRole("link", { name: "戻る" }).click();

  // --- 3. 予約の確認とキャンセル ---
  await page.getByRole("link", { name: /マイページ/ }).click();
  await expect(page).toHaveURL("/mypage");

  // 【重要改善】: CSSクラスへの依存を排除
  // 日付テキストと時間を含む予約カードを特定（同日の別時間の予約を誤って消さないため）
  const targetCard = page
    .getByTestId("reservation-card")
    .filter({ hasText: displayDate })
    .filter({ hasText: "18:00" })
    .first();
  
  await expect(targetCard).toBeVisible();

  // キャンセルダイアログのハンドリング
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  // 【重要改善】: キャンセルボタンの特定
  // aria-label を使ってボタンを特定
  const cancelButton = targetCard.getByRole("button", { name: "予約をキャンセル" });
  await cancelButton.click();

  // 検証: カードの消滅
  await expect(targetCard).not.toBeVisible();
});