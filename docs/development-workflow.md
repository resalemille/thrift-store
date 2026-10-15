# 開発フロー

## 適用範囲

サイトの機能追加、デザイン変更、コンテンツ構造の変更、外部サービス連携、バグ修正など、リポジトリに変更を加える実装依頼に適用します。

ユーザーから「直接mainへ反映してよい」と明示された場合を除き、`main` で直接作業・直接pushは行いません。

## 標準フロー

1. `main` を最新化し、作業ツリーに未コミット変更がないことを確認する。
2. 依頼ごとに `codex/<内容を表す短い名前>` のブランチを作成し、専用のGit worktreeで作業する。
3. worktree内の `AGENTS.md` と関連ドキュメントを確認してから実装する。
4. 実装とあわせて、変更内容に対応するテストを追加または更新する。設計・運用に影響する内容は `docs/` も更新する。
5. `npm test` など、変更に見合う検証を実行する。結果と既知の制約をPR本文に記載する。
6. worktree内でコミットし、作業ブランチをpushする。
7. `main` をbaseとするPull Requestを作成する。PRには目的、主な変更、検証結果、確認が必要な点を日本語で簡潔に記載する。
8. PRのURLを共有し、レビューとマージはユーザーの指示を待つ。明示的な依頼がない限り、CodexはPRを自己マージしない。
9. マージ後はGitHub ActionsとGitHub Pagesのデプロイ結果を確認し、問題があれば新しいworktree／PRで対応する。

## worktree運用ルール

複数Issueをまとめて依頼する場合は [multi-issue-prの使い方と検証](multi-issue-pr.md) を参照する。指定されたIssueごとにsubagentと専用worktreeを分け、依存関係を確認して個別PRを作成する。

- worktreeは依頼ごとに1つ作成し、目的がわかるディレクトリ名にする。
- 既存の `main` worktreeや、ユーザーが作業中の未コミット変更は変更しない。
- 作業完了後も、PRがマージまたは破棄されるまではworktreeを保持する。
- worktreeの削除は、対象PRの状態と未コミット変更がないことを確認してから行う。

## 例外

緊急修正、リリース作業、または直接 `main` への変更・pushをユーザーが明示的に指示した場合のみ、このフローを省略できます。その場合も、実行した検証内容と直接反映した理由を記録します。

## PRプレビュー（Issue #10）

GitHub PagesのSourceは **GitHub Actions** のまま使用する。現在は独自ドメインのため、本番は `https://thrift-store.resalemille.online/`、PR #123は `https://thrift-store.resalemille.online/pr-preview/pr-123/` となる。Issueに記載された旧 `/sample` の公開先には戻さない。

- 同一リポジトリからmain向けのPRを作成・再オープン・更新すると、検証後にプレビューを公開する。公開完了後のBotコメントから確認でき、更新時は同じコメントを更新する。
- フォークのPRは公開対象外。プレビューは公開URLなので機密情報を含めない。
- `preview-cache` はワークフローが初回に作成する保存専用ブランチ。PagesのSourceに設定せず、手動編集しない。本番はルート、各PRは `pr-preview/pr-<番号>/` に保存する。
- 初回のPR公開でもmainを別途ビルドして本番を保持する。本番更新はプレビューを保持し、PR更新・クローズは対象PRだけを差し替え・削除する。PR用のCNAMEはコピーしない。
- 本番・PR・削除は共通の `pages` concurrency groupで直列実行する。`queue: max` により待機中の別PRを取り消さない（上限100件）。キュー上限や失敗で未反映の場合は該当Actions実行を再実行する。デプロイ失敗後も保存ブランチは保持され、次回の公開で全体を再送する。
- `github-pages` Environmentは参照しない。既存の環境保護ルールを変更せずにPRの公開を許可するためである。Actionsにはcontents / pages / pull-requestsのwriteとid-tokenのwriteが必要。ビルドジョブはreadのみとし、フォークに書き込み権限を与えない。
- `ASTRO_BASE_PATH` でビルド時のbaseを切り替える（通常 `/`、PR `/pr-preview/pr-123`）。内部リンク・publicアセットは `src/lib/paths.ts` の `link()` 経由で参照し、公開パスを直接固定しない。

### 検証

`npm test` は既存のページ検証に加え、キャッシュの複数PR共存・更新・本番更新・削除を検証する。さらに `/`、`/sample`、`/sample/pr-preview/pr-123`、`/pr-preview/pr-123` でビルドし、全HTMLの内部リンク・画像・favicon・CSS・JavaScriptが指定base配下にあり、参照先が存在することを確認する。現サイトにはクライアントJavaScriptがないため、テスト中だけ一時ページを作り、Astroが生成する外部JavaScriptのURLも検証してから削除する。

導入PRのマージ後、異なる内容のテストPRを2件開く。両方のBotコメントとトップ・下層ページ、画像、favicon、CSS、JavaScriptの読み込みをブラウザで確認する。一方を更新してコメントが増えないこと、一方を閉じて対象だけが消えること、mainの公開後も残ったプレビューが表示されることを確認する。導入前のmainには新ワークフローがないため、クローズ・main公開を含む一連の確認は導入PRのマージ後に実施する。


## Biomeによるローカル検証（Issue #8）

依存関係は `npm ci` でインストールする。PR前には次の順に確認する。

1. `npm run format`: 対象ファイルを整形する（書き換えあり）。
2. `npm run lint`: 推奨ルールによる静的解析。警告も失敗として扱う。
3. `npm run format:check`: 整形漏れの検出（書き換えなし）。
4. `npm test`: Astroの型・テンプレート検証、静的ビルド、ページ・公開パスの検証。

`npm run check` と `npm run build` は個別にも実行できる。Biomeは `astro check` の代替ではない。GitHub ActionsへのBiome追加は別Issueの対象とする。

対象は `biome.json` の `files.includes` で管理する。`src/` のAstro・TypeScript・JavaScript・CSS・JSON、`scripts/`、`tests/`、ルートのJSON・MJS設定、および `docs/` の対応形式を検査する。Gitの除外設定も利用し、依存関係・生成物（`node_modules/`、`dist/`、`.astro/`）、自動生成の `package-lock.json`、画像は除外する。

固定バージョンのBiome 2.5.15ではMarkdown・YAMLは非対応のため、`docs/*.md`、README、AGENTS、Actions YAMLは整形・lintされない。ドキュメントの文章・リンク・コード例はレビューで確認する。対応範囲は[Biome公式の言語対応表](https://biomejs.dev/introduction/language-support/)を参照する。

Astroは実験的なHTML全体の解析・整形を有効化している。更新時は差分と `astro check`・ビルド結果を確認する。CSSではTailwind構文を有効化し、別コンポーネント間のセレクターも比較してしまう `noDescendingSpecificity` のみ無効化する。委託販売ページの比較表はキーボードで横スクロールできるようにするため、そのページだけ `noNoninteractiveTabindex` を無効化している。
