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

### 2026-10-15 — Issue #26

- 金・貴金属バナーを、実際の商品撮影に近い落ち着いた質感の画像へ差し替え。2本の薄い金塊を離して平置きし、金属の反射・接地影・布の織り目を自然にした。ジュエリーはチェーン・リング・ペンダントに整理し、金貨2枚を添える。
- 左側にコピー用の余白を確保し、過度なオレンジ色・強い輪郭の光・不自然な表面模様を抑えた。
- 使用画像は `public/images/gold-resale-mille.webp`（2172×724）。組み込み画像生成ツールで作成したイメージ写真をWebPへ変換。実在の商品の撮影記録ではない。
- 最終生成プロンプト:

```text
Create a NEW photorealistic 3:1 horizontal banner photograph for a Japanese precious metals resale website. It is an understated real product still life, NOT a glossy advertisement or 3D rendering.
Composition: left 55 percent of frame is empty plain warm beige matte fabric, one or two broad gentle folds, no patterns. The right 45 percent contains a modest, sparse still life of TWO small real gold bullion bars, two gold coins, a loose gold curb necklace, one delicate gold ring with a small solitaire diamond and a small diamond pendant. All objects fit in the right half; the two bars are parallel and separately resting on dark charcoal velvet in the upper right, with a visible strip of cloth separating them. Do not stack the bars. Coins lie separately flat in the foreground. Jewelry is loosely arranged with large natural gaps.
The bars are physically realistic small minted bullion bars, thin rectangular plates about 50mm by 30mm by 5mm, softly beveled corners. Smooth brushed yellow gold with a few extremely faint hairline scratches, broad rectangular softbox reflections, dark reflected areas on their sides. Each has ONLY a discreet exact stamped marking "FINE GOLD" on one line, "999.9" underneath and "100 g" underneath. Fine regular restrained engraving, no logos, no repeated marks. Not thick bricks. The coins are smaller in diameter than the length of the bars, with one simple classical profile in shallow embossed relief, realistically thin rims, fine reeded edges, no visible letters. They must not look like chocolate coins.
Photograph using a full frame still-life camera, 85mm lens, f/5.6, naturally focused on foreground ring and coins, the bars at the back are slightly softer. Soft neutral daylight from a large window on the upper left with a small white reflector. Natural neutral white balance, realistic pale warm yellow gold; restrained saturation, moderate contrast, gentle falloff, normal shadow detail. No drama. Velvet is a fine simple textile, slightly compressed under objects, not strongly sculpted waves. The beige backdrop is almost matte and entirely plain. Use optically plausible depth and reflections. Diamond facets show small muted white and gray reflections without sparkling star effects.
Real professional auction-catalog product photography with subtle physical imperfections and ordinary lens rendering. No CG, no illustration, no HDR, no cinematic grading, no oversharpened outlines, no high-gloss plastic, no hammered or crackled metal, no swirling microtextures, no overly rich orange gold. No graphic elements, no overlay text, no watermark. A complete photograph at 2172x724 or closest 3:1 aspect ratio.
```

- 既存のWebP形式・HTML指定寸法・配信ファイル一致のテストを継続。実寸2172×724と、金塊・金貨・ジュエリーの配置を変換画像とブラウザーで確認した。
- `npm run format` / `npm run lint` / `npm run format:check` / `npm test` 成功。型検査エラー・警告なし、26ページ、24テスト、4種類のbase pathを検証。lintの既存情報レベル指摘1件は変更対象外。

### 2026-10-16 — Issue #24

- トップの買取実績と利用の流れの間に「お客様の口コミ・評判」を追加。
- Issue添付画像で全文を確認できる4件を `src/data/reviews.ts` に転記。5つ目は全文の画像がないため追加していない。参考画像の他店名を使わず、本文・地域・年代・星5つの評価を掲載する。ユーザー合意によりサンプル・出典の注記は表示しない。
- 既存のアイボリー、チャコール、アンティークゴールドと明朝見出しを使用。画像を転載せず、人物は共通の線画とする。
- 自動再生なし。左右ボタン・位置選択ボタン・横スワイプ・一覧にフォーカスした状態の左右キーで操作する。最初と最後では対応する矢印を無効化する。
- ネイティブの横スクロールとscroll snapで、JavaScriptが無効でも全文を読める。操作ボタンはJavaScriptの初期化後に表示し、スクロール・画面幅変更に応じて選択位置と読み上げ状態を更新する。動きを減らす設定では即座に切り替える。
- `ReviewsCarousel.astro` が表示と操作を担当。口コミの追加・差し替えはデータファイルを編集し、カード数と位置ボタン数は自動で連動する。
- 検証: `npm test` 成功（型検査エラー・警告なし、26ページ生成、29テスト、4種類のbase path）。`npm run lint`・`npm run format:check` 成功。320px・390px・1280px幅でページの横はみ出しがないこと、位置選択・前後ボタン・左右キー・横スクロールの連動をブラウザで確認。
- 口コミの横スクロールをキーボードで操作できるよう `tabindex="0"` を指定するため、Biomeの `noNoninteractiveTabindex` はこのコンポーネントのみ既存の例外対象に追加。


### 2026-10-16 — Issue #28

- トップ・フッター・店舗一覧の「店舗を探す」を「店舗を予約する」に統一。リンク先は引き続き `/stores/` とし、店舗詳細の「この店舗に相談する」から `/contact/` へ進む既存導線を維持する。予約機能の新設は含めない。
- 店舗一覧の紹介文は、完全予約制・お品物の事前ヒアリング・スムーズな査定・安心して相談できる丁寧なサービスを伝える内容に変更。トップも「完全予約制でスムーズなご案内」とし、待ち時間ゼロの断言を避ける。
- FAQ・店舗詳細に反映済みの完全予約制の案内を維持。生成された全ページの旧表記の除去、紹介文、予約と相談のリンク先をテストする。
- 検証: `npm test` 成功（型エラー・警告なし、26ページ生成、29テスト、4種類のbase path）。`npm run lint` / `npm run format:check` 成功。lintは既存スクリプトの情報レベル指摘1件のみ。
