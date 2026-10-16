# コンテンツと表示処理の分担

## 編集するファイル

- `src/data/site.ts`: サイト名、共通の連絡先・営業時間
- `src/data/items.ts`: 買取品目と `Item` 型
- `src/data/stores.ts`: 店舗と `Store` 型。共通の連絡先は `site.ts` を参照
- `src/data/cases.ts`: 買取実績と `Case` 型
- `src/data/brands.ts`、`faqs.ts`、`news.ts`: ブランド、FAQ、お知らせ
- `src/data/consignment.ts`、`reviews.ts`: 委託販売、お客様の声

ページとコンポーネントは必要なファイルから直接importします。複数分野の情報を集約するファイルを作らず、店舗とFAQなどの独立した改修が同じファイルに集中することを避けます。型も各データのファイルで管理します。

## 処理の追加と検証

表示するデータの選択処理は `src/lib/` の純粋関数として実装し、引数でデータを受け取ります。Astroの実行環境や本番データに依存させず、空配列や複数件などの条件を小さなテストデータで検証できます。買取品目ごとの実績選択は `casesForItem()` を使います。

`npm run test:unit` はビルドせずに `tests/unit/` の単体テストを実行します。Node.js 22.12以上の型除去機能を使用するため、テスト対象のTypeScript間のimportには `.ts` を明記し、実行時の変換が必要なTypeScript構文は使用しません。`npm test` にも含まれます。

現在、実績の品目・店舗は表示名で関連付けています。名称変更時は実績側も更新してください。単体テストではslugの重複・形式と、実績の参照先・価格を確認します。HTMLの表示・リンク・画像は既存のビルド後テストで確認します。データ項目や表示を拡張するときは、必要な単体テストとページ検証をそれぞれ更新します。

## 会社情報と販売条件

会社概要は `src/pages/company/index.astro`、特定商取引法に基づく表記は `src/pages/tokushoho/index.astro` で管理します。フッターから両ページに移動できます。

会社概要はIssue #35の指定内容（平塚市の重複を修正）と、公式サイトで確認した代表者を掲載しています。特定商取引法の全項目は https://www.resalemille.online/tokushoho を参照し、返品特約は https://www.resalemille.online/shipping-returns にリンクします。販売条件の変更時は参照元との整合性を確認してください。引き渡し時期は特定商取引法の参照元に合わせています。
