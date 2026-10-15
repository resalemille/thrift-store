# プロジェクトメモ

## 目的

買取サービス企業の静的サイトを Astro で制作する。WordPress や独自バックエンドは使用せず、GitHub Pages で公開する。

## 現在の構成

- Astro 7 / TypeScript strict / Tailwind CSS 4
- 公開URL: `https://thrift-store.resalemille.online/`
- 公開パス: `/`（カスタムドメインのルート）
- 将来のコンテンツ管理: microCMS
- 将来の問い合わせ送信: Formspree

## 実装方針

- 店名は「買取のResale Mille（リセールミル）」とする。運営会社情報・店舗・実績など未確定の情報は差し替え前提のダミーとする。
- 動的な一覧／詳細ページは、microCMS導入前は `src/data/` の仮データを使用する。
- GitHub Pages は静的ホスティングのため、公開時は microCMS の読み取り専用キーを GitHub Actions の環境変数に設定してビルドする。
- FormspreeのフォームIDが未発行の間、問い合わせフォームは送信先未設定の案内を表示する。
- microCMSは接続せず、画面は `src/data/site.ts` のダミーデータで構築する。
- 外部サービスの接続前は、ダミーであることと未送信であることを画面に明記する。

## テスト方針

- `npm test` はAstroの型検査と静的ビルド後に、主要ページの生成、GitHub Pagesのbase path、外部サービス未接続の状態、ダミー表記を検証する。
- 新しいページや外部連携の実装時は、対応するテストを追加・更新する。
- 現在は全生成ページの内部リンクも検証対象とする。

## 開発フロー

実装依頼は原則として専用のGit worktreeで行い、テスト後にPull Requestを作成する。詳細は[開発フロー](./development-workflow.md)を参照。

## 今回の仮サイト範囲

- トップページ
- 店舗一覧・店舗詳細
- 買取実績一覧・詳細
- 買取品目一覧・詳細
- ブランド一覧
- よくある質問
- お知らせ一覧
- お問い合わせ
- 会社概要・プライバシーポリシー

## 確定待ちの情報

- 正式ロゴデータ（店名・ブランド配色はIssue #16で反映済み）
- 運営会社情報、古物商許可番号
- 対応地域（店舗情報・電話番号・営業時間はIssue #23で反映済み）
- 買取対象・買取方法・実績
- 写真素材と掲載許諾
- microCMSサービスID・APIキー・コンテンツモデル
- FormspreeフォームIDと送信先メールアドレス

## 変更履歴

### 2026-09-12

- Tailwind CSS 4 を導入。
- GitHub Pagesの `/sample/` 配下でファビコンを正しく参照できるよう調整。
- ダミーコンテンツによる一式のサイト実装に着手。
- トップ画像として、生成したダミー用の店舗内観を `public/images/hero-shop.png` に追加。
- 25ページのダミーサイトと、静的ページを対象にした自動テストを追加。

### 2026-09-13

- Git worktreeとPull Requestを標準とする開発フローを文書化。
- 品目詳細に、同じ品目の買取実績と参考価格を表示するダミーセクションを追加。将来はmicroCMSの買取実績データを同じ条件で表示する。
- トップのメインコピーが途中で改行されないよう、デスクトップの表示幅と改行制御を調整。
- トップページに金・貴金属の強化買取セクションを追加。独自生成した静物ビジュアルを `public/images/gold-purchase.png` に配置し、金・貴金属の詳細・相談ページへ誘導する。
- 傷・破損・付属品なしなど、状態にかかわらず相談できる買取セクションを追加。独自生成した品物の静物ビジュアルを `public/images/condition-purchase.png` に配置し、査定可否・金額は実物と市場状況により案内する旨を明記した。

### 2026-09-16

- リポジトリ移行後のGitHub Pages公開先に合わせて、Astroの `site` を `https://resalemille.github.io`、`base` を `/thrift-store` に更新。生成されるCSS、内部リンク、公開アセット、ファビコンの参照先を新しい公開パスに統一した。
- 状態不問の買取相談セクションの見出しを、デスクトップでは一行で表示するよう修正。モバイルでは可読性を保つため自然に改行する。
- ファーストビュー下部に、店舗一覧とお問い合わせへ遷移する大きな二分割CTAを追加。デスクトップでは横並び、モバイルでは縦並びで表示する。
- カスタムドメインへの切り替えに合わせて、Astroの `site` を `https://thrift-store.resalemille.online` に更新し、リポジトリ名を含む `base` を削除。CSS、リンク、公開アセットをカスタムドメインのルートから読み込むよう変更し、`public/CNAME` でドメイン設定を保持する。

### 2026-10-15 — Issue #16

- 店名を「買取のResale Mille（リセールミル）」に統一。全ページのタイトル・メタ説明・ヘッダー・フッター・会社概要・プライバシーポリシーから旧店名を置換した。法人格は未確認のため追加していない。
- 参考画像に合わせ、チャコール（`#282725`）・アイボリー（`#f8f6f0`）・アンティークゴールド（`#ae9865`）を基調に共通配色と枠・見出し・メニューを変更。`ink` / `gold` のTailwindトークンは `src/styles/global.css` で定義する。
- トップに参考画像のコピーと「高価買取の実績」「幅広い買取対象」「安心・誠実な対応」の3カードを実装。Web査定・店舗検索・出張予約を並べ、モバイルは縦並びにする。
- 店舗検索は `/stores/`、Web査定・出張予約は `/contact/` へ `link()` 経由で遷移する。同じ公開先のパスを使い、本番とPRプレビューの両方を維持する。
- 金買取はゴールドの写真バナー、状態別案内は個別の写真入り金枠カードに変更。既存の4項目・説明文・査定可否注記・既存リンクを保持した。暗い店舗案内は見出しと説明文の明度を調整する。
- 新しい生成写真は `public/images/hero-resale-mille.webp`、`gold-resale-mille.webp`、`condition-resale-mille.webp`。文字・ボタンはHTMLで実装し、画像に埋め込まない。正式ロゴは未支給のため文字ロゴと仮の線画マークを使用する。
- `tests/site.test.mjs` で全ページの店名、3つのCTAのリンク、選ばれる理由、状態別の4項目と説明文、写真アセット、配色を検証する。`npm test` は既存の内部リンク・PRプレビューのbase検証も継続する。

#### 写真の生成記録

組み込みの画像生成ツールを使用し、次のプロンプトで作成。元の生成画像を残してWebPへ形式変換した。

- `hero`: Use case: photorealistic-natural. Create a wide landscape website hero photograph, 3:1 composition, for a premium Japanese resale appraiser. Reference style is a dark charcoal paneled antique boutique: antique walnut sideboard and warm table lamp at far left, small vase and framed art, open watch presentation boxes and silver luxury watches at lower left. At lower right a black quilted handbag without visible logos, a gold watch, loose gemstones, and a tall pale celadon ceramic antique vase. Dark charcoal empty center and upper middle reserved for large white webpage headings (do NOT draw any text). Moody soft warm lighting, realistic material texture, restrained expensive atmosphere, charcoal, walnut, antique gold, ivory. No people, no text, no typography, no buttons, no watermarks. The objects fill the outer left and outer right edges; the middle 55% remains dark uncluttered negative space. Full bleed photo, no frame.

- `gold`: Use case: product-mockup. Wide landscape 3:1 full bleed website campaign photograph for a premium Japanese gold resale store. Three realistic gold ingots, gold coins, delicate gold necklaces and diamond jewelry laid on charcoal black velvet, all composed entirely in the RIGHT HALF of the image. LEFT HALF is simple softly lit muted antique gold / champagne satin backdrop with generous clean negative space for webpage headings (do NOT draw any text). Luxurious quiet studio product photography, warm highlights, photorealistic textures, elegant diagonal transition from gold backdrop on left to black velvet on right. No text, no typography, no watermark, no buttons, no logos.

- `condition`: Use case: product-mockup. Create a wide 3:1 photograph strip for a premium Japanese secondhand appraiser website. FOUR equally wide vertical still life compositions seamlessly arranged side by side, each occupies exactly one quarter of the image, same dark warm charcoal tabletop background and moody soft lighting throughout. First quarter: a broken fine gold chain necklace and single pearl earring. Second quarter: a worn brown designer style handbag with scuffed leather edges, no logos. Third quarter: a stopped silver wristwatch beside an old silver-and-black film camera. Fourth quarter: an old amber liquor bottle without label and a small open empty watch presentation box. Each group fully fits its quarter with some margin, all objects clearly visible. Realistic editorial studio photography, muted gold, brown and silver, premium quiet atmosphere. No text, no labels, no watermarks, no frames, no typography.

#### 検証結果

- `npm test`: 型検査でエラー・警告なし、25ページ生成、14テスト成功。4種類のbase pathで全生成リンク・アセットの参照先を確認。
- Chromeで320px・390px・768px・1680px幅を確認し、トップページに横スクロールが発生しないことを確認。390px幅でメニューの開閉と店舗一覧への遷移を確認。
- デスクトップでトップ・金買取・状態別カードの写真・見出し・枠を確認。モバイルのメインコピーは文節で折り返す。


## Issue #20: トップのボタンと予約案内

- ヒーローの3ボタンは均等幅・同じ高さとし、モバイルの縦並びでも高さを揃える。
- 枠付きボタンの矢印は文字グリフではなくCSSの線で描画し、本文と上下中央を揃える。
- 店舗・出張買取は完全予約制。「完全予約制で待ち時間なし」と案内し、FAQ・店舗の特徴・来店案内も統一する。
- `npm test` で予約案内と全ページに予約不要の表示が残っていないことを検証する。画面ではPCの3列・モバイルの1列のボタン寸法と矢印の中央配置を確認する。

### 2026-10-15 — Issue #23

- 店舗一覧・詳細・トップの店舗案内を銀座店・平塚店・横浜店へ更新。住所・アクセスはIssue記載の情報を使用し、詳細写真はIssue添付の支給画像をそのまま掲載する。
- URLは `/stores/ginza/`、`/stores/hiratsuka/`、`/stores/yokohama/`。旧kanda・kichijojiページや転送は生成しない。
- 電話番号はサイト全体で0463-64-2885、全店舗の営業時間と共通受付時間は10:00〜22:00（年中無休）に統一。
- 仮の紹介タグは削除し、既存の完全予約制の案内は本文に維持。店舗一覧のダミー表記を削除し、共通フッターは店舗情報以外に仮の情報が含まれる旨へ変更。
- 買取実績・お知らせなどの仮コンテンツは引き続き未確定情報として扱う。
- 検証: `npm test` で型エラー・警告なし、26ページ生成、23テスト成功。4種類のbase pathで内部リンク・画像・アセットを検証。`npm run lint` / `npm run format:check` 成功（lintは既存スクリプトのinfo 1件のみ）。銀座店の写真と情報配置をブラウザーで確認。

- 写真の追加調整: 銀座店・横浜店の左右の黒帯をCSSの表示範囲で除外。支給画像自体は保持し、写真部分の縦横比と位置を指定して建物全体を表示する。平塚店は元の全体表示を維持。
