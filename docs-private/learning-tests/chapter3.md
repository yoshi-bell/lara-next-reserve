# 第3章: Storybook とビジュアルリグレッションテスト

## 1. Storybook とは
UIコンポーネントをアプリケーション本体から切り離し、独立した環境で開発・確認・テストするためのツール。コンポーネントを「Story」としてカタログ化し、閲覧・操作できる。

### 主な利点
*   **分離された開発環境:** ビジネスロジックやAPI通信を気にせず、UIの見た目とインタラクションに集中できる。
*   **コンポーネントカタログ:** プロジェクト内のUIパーツが一覧化され、再利用性が高まる。デザイナーとの意思疎通も円滑になる。
*   **多様な状態のシミュレーション:** `Primary`, `Disabled`, `Error` など、Propsによる見た目のバリエーションを簡単に切り替えて確認できる。
*   **テスト連携:** ユニットテストやビジュアルリグレッションテスト（VRT）の基盤として活用できる。

## 2. ビジュアルリグレッションテスト (VRT) とは
「見た目の回帰テスト」。コードの変更によって、意図せずデザインが崩れたり変わったりしていないかを、画像比較によって検出する手法。

### 基本的な流れ
1.  **基準 (Baseline) 画像の作成:** 正解となるスクリーンショットを保存。
2.  **比較画像の作成:** 変更後に再度スクリーンショットを撮影。
3.  **差分 (Diff) 検出:** 2つの画像をピクセル単位で比較。
4.  **確認:** 差分があれば失敗。意図した変更なら基準を更新し、意図しないものなら修正する。

## 3. なぜ VRT が重要なのか
*   **CSSの影響範囲の検知:** CSSの変更は予期せぬ場所へ影響を及ぼしやすく、ユニットテスト（ロジック検証）やE2Eテストでは「角丸が消えた」「色が少し変わった」といった変化を検知しにくい。
*   **UI品質の維持:** 自動化することで、手動確認の手間を省きつつ、一貫したUI品質を保証できる。

## 4. Storybook と VRT の相性
Storybookはコンポーネントのあらゆる状態（Story）をカタログ化しているため、それらをそのまま VRT のテストケースとして利用できる。Chromatic などのツールと組み合わせることで、効率的な視覚テスト環境を構築できる。

---

## 5. Storybook のセットアップ
Next.jsプロジェクトのルートで以下のコマンドを実行する。
```bash
npx storybook@latest init
```
*   `.storybook/`: 設定ファイルを格納。
*   `src/stories/`: サンプルのStoryファイルを格納。
*   起動コマンド: `npm run storybook` (デフォルトは http://localhost:6006)

## 6. 主要な設定ファイル
*   **.storybook/main.ts**: Storybookのメイン設定。読み込むファイルのパスや、使用するアドオンを定義する。
*   **.storybook/preview.ts**: 全Story共通の表示設定。Tailwind CSSを使用している場合は、ここで `globals.css` をインポートする必要がある。

## 7. Story の書き方
コンポーネント（例: `Button.tsx`）と同じ階層に `Button.stories.tsx` を作成する。

### 基本構造
1.  **Metaデータ (`Meta`)**: Storybook上でのタイトルや対象コンポーネント、コントロール（Propsの操作UI）の型を定義。
2.  **Storyオブジェクト (`StoryObj`)**: コンポーネントの特定の状態を定義。
3.  **Args**: コンポーネントに渡すPropsの値を指定。

```typescript
// Button.stories.tsx の例
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'ボタン',
  },
};
```

---

## 8. ハンズオン: Storybook と Playwright による VRT
`@storybook/test-runner` を使用し、Storybookの全Storyを巡回してスクリーンショットを撮影・比較する。

### セットアップ
1.  **インストール:**
    ```bash
    npm install -D @storybook/test-runner @storybook/test-playwright
    ```
2.  **スクリプト追加 (`package.json`):**
    ```json
    "test:vrt": "test-storybook"
    ```

### テストの実装
`test-runner-jest.config.js` 等で Playwright のテストファイルを指定し、以下のようなテストロジック (`vrt.test.js`) を記述する。

```javascript
const { test, expect } = require('@playwright/test');
// ... (サーバー起動処理)

describe('VRT', () => {
  // 全Storyに対してループ実行
  server.stories.forEach((story) => {
    test(story.id, async ({ page }) => {
      await page.goto(server.url + '?path=/story/' + story.id);
      // スクリーンショット比較 (Playwrightの機能)
      await expect(page).toHaveScreenshot(`${story.id}.png`);
    });
  });
});
```

### 実行フロー
1.  **初回実行:** `npm run test:vrt` → 基準画像が `__screenshots__` に生成される（テストは失敗扱いになる場合がある）。
2.  **基準画像の確認:** 生成された画像が正しい見た目か確認し、Gitにコミットする。
3.  **2回目以降:** `npm run test:vrt` → 基準画像と現在の見た目を比較。差分があれば失敗。
4.  **基準更新:** 意図的な変更の場合は、`--update-snapshots` フラグを付けて実行し、基準画像を更新する。

---
**✨ まとめ:**
StorybookはUI開発のハブとして機能し、コンポーネントのカタログ化と独立開発を可能にする。VRTと組み合わせることで、ロジックだけでなく「見た目」の品質も保証できる。Storybookで定義したStoryを `test-runner` で巡回し、Playwrightで画像比較を行うことで、効率的かつ網羅的なUIテスト環境が構築できる。
