# 買取実績の写真と店舗（Issue #27）

## 掲載方針

- Issue #27添付の6枚を `public/images/case-*` に保存し、GitHubへの外部参照に依存せず配信する。
- `src/data/site.ts` の `cases` をトップ・実績一覧・詳細・品目別の共通データとして使用する。バーキンの参考価格は3,000,000円。
- 写真は元の縦横比を保ち、一覧の高さ固定枠と詳細の正方形枠で `object-contain` により全体を表示する。比率の違いは白い余白で調整し、トリミングしない。
- 写真ごとの代替テキストと元画像の寸法を共通データに保持する。画像パスは `link()` で本番とPRプレビューのbaseに対応する。
- 買取店舗は銀座店・平塚店・横浜店から今回一度だけランダムに選んでデータに保存した。表示時やビルド時に再抽選せず、同じ実績は全ページで同じ店舗を表示する。

- カメラ写真はNikon D850のため、ユーザー確認のうえ表記を「デジタル一眼レフカメラ／ニコン」に合わせる。既存リンク維持のためURLの `leica-camera` は変更しない。

## 写真の出典

すべて [Issue #27](https://github.com/resalemille/thrift-store/issues/27) のユーザー指定添付画像。加工せず元の画像形式で保存する。

| 実績 | ファイル | 添付画像ID |
| --- | --- | --- |
| エルメス バーキン | `case-hermes-birkin.webp` | `2eae79c9-5d7d-4b74-a0bd-77d56fc0696f` |
| ロレックス デイトジャスト | `case-rolex-datejust.webp` | `bcf8482e-5384-4686-97fb-ea10b83843e6` |
| ダイヤモンドリング | `case-diamond-ring.webp` | `add668f2-3d8e-43be-8b44-1af1d74094ce` |
| K18 ネックレス | `case-gold-necklace.webp` | `e92dffa4-527a-4424-8bce-e8bde3b63ffd` |
| カメラ | `case-leica-camera.jpg` | `cb52f4e9-e210-4454-84f3-f39fc8dc8954` |
| 茶道具一式 | `case-tea-bowl.png` | `6372d39e-7d57-4074-80f8-d552de840745` |

## 検証

`npm test` で6件の写真・代替テキスト・寸法・全体表示指定、掲載先の店舗と価格の一致、既存の全ページとPRプレビューの内部参照を検証する。`npm run lint` と `npm run format:check` も実行する。
