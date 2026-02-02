# リファクタリング提案書

`lara-next-reserve` プロジェクトの現状分析に基づき、保守性・拡張性・堅牢性を向上させるためのリファクタリング案を提案します。

## 概要

バックエンド（Laravel）とフロントエンド（Next.js）の責務分離はできていますが、型安全性やAPIレスポンスの管理において改善の余地があります。これらを整備することで、将来的な機能拡張時のバグ発生リスクを低減できます。

## 優先度: 高（High）

### 1. [Frontend] 型定義の共通化（Centralized Type Definitions）

**現状の課題:**

- `hooks/useMyReservations.ts` など、各ファイル内で `interface Reservation` や `Shop` が個別に定義されています。
- 定義が重複しており、API仕様変更時に修正漏れが発生するリスクがあります。

**改善案:**

- `src/types/models.ts` （または `src/types/index.ts`）を作成し、共通の型定義を集約する。
- 各コンポーネントやHooksからは共通型定義をインポートして使用する。

### 2. [Backend] API Resourcesの導入

**現状の課題:**

- Controller (`ReservationController@index`など) で `return response()->json($data)` を使用し、Eloquentモデルを直接返却しています。
- DBカラムの変更がFEに直接影響する、不要なデータ（内部IDやタイムスタンプなど）が露出する可能性があります。

**改善案:**

- Laravelの `JsonResource` (API Resource) を導入する。
- `ReservationResource` クラスを作成し、レスポンスの構造を明示的に定義・変換する。

## 優先度: 中（Medium）

### 3. [Backend] サービス層へのロジック完全移行

**現状の課題:**

- `ReservationController@index` 内にクエリ構築ロジック（`where`, `with`, `orderBy`）が記述されています。
- 検索条件が複雑化した場合、Controllerが肥大化します。

**改善案:**

- クエリロジックを `ReservationService` または専用のリポジトリに移譲する。
- Controllerは「入力受付 -> Service呼び出し -> Resource返却」の責務に集中させる。

### 4. [Frontend] APIクライアントの整備

**現状の課題:**

- `axios` の設定は `lib/axios.ts` にありますが、各Hooks内の `fetcher` で直接 `axios.get` を呼んでおり、戻り値の型安全性が SWR のジェネリクス頼みになっています。

**改善案:**

- APIリクエスト関数群（`services/api.ts` 等）を作成し、各エンドポイントの呼び出しと戻り値の型定義をセットで管理する。

## 優先度: 低（Low）/ 今後の検討

### 5. APIドキュメントの自動生成

- `Scribe` などを導入し、バックエンドの実装からAPI仕様書を生成できるようにする。

### 6. テストの拡充

- `learning-tests` だけでなく、実際の業務ロジック（Service）やE2Eテスト（Playwright）をプロジェクト本体のCIフローに組み込む。
