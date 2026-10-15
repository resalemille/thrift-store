# 開発フロー

## 適用範囲

サイトの機能追加、デザイン変更、コンテンツ構造の変更、外部サービス連携、バグ修正など、リポジトリに変更を加える実装依頼に適用します。

ユーザーから「直接mainへ反映してよい」と明示された場合を除き、`main` で直接作業・直接pushは行いません。

## 標準フロー

1. 作業ツリーと既存worktreeの状態を確認し、`git fetch origin main` で最新の `origin/main` を取得する。既存の未コミット変更は保護し、mainの作業ツリーを変更しない。
2. 最新の `origin/main` から、依頼ごとに `codex/<内容を表す短い名前>` のブランチと専用Git worktreeを作成する。
3. worktree内の `AGENTS.md` と関連ドキュメントを確認してから実装する。
4. 挙動の追加・変更には必要なテストを追加または更新する。設計・運用・利用方法に影響する内容は `docs/` も更新する。文章のみの変更に形式的なテストを追加する必要はない。
5. `npm test` など、変更に見合う検証を実行する。結果と既知の制約をPR本文に記載する。
6. worktree内でコミットし、作業ブランチをpushする。
7. `main` をbaseとするPull Requestを作成する。PRには目的、主な変更、検証結果、確認が必要な点を日本語で簡潔に記載する。
8. PRのURLを共有し、レビューとマージはユーザーの指示を待つ。明示的な依頼がない限り、CodexはPRを自己マージしない。
9. マージ後はGitHub ActionsとGitHub Pagesのデプロイ結果を確認し、問題があれば新しいworktree／PRで対応する。

## 調査と検証の範囲

- 調査はIssue本文・必要なコメント・関連PRと、受け入れ条件に関係する実装・テスト・資料を優先する。分からない点が残った場合に範囲を広げ、無関係なファイルや履歴の全件読み込みを避ける。
- 同じチャット内で確認済みの資料は、更新・不足がある場合だけ再読する。専用worktreeに適用されるルールは確認する。
- 検証コマンドと対象の変更状態、結果を把握し、関連する変更・失敗・未解決の懸念がなければ成功済み検証を繰り返さない。コード修正やmain取り込み後は影響範囲を再評価し、必要な検証を再実行する。
- `npm test` は型チェック・ビルド・Nodeテスト・公開パス検証を含む。同じ変更状態で `npm run check` や `npm run build` を別途繰り返さない。ただし、原因切り分けやプレビュー準備など目的がある場合は個別実行してよい。
- 実装・設定・テストの変更では、後述のBiome検証と `npm test` を実行する。Markdownのみの変更では文章・リンク先・ルール間の整合性と `git diff --check` を確認し、ローカルでの依存関係インストールやアプリのビルド・テストは不要。CIは従来どおり実行され、必須チェックを省略しない。
- 成功ログは終了結果と要点を確認し、全文を何度も読み込まない。失敗時は関連する詳細ログを確認する。

## ドキュメントと作業記録

`docs/` には今後参照する仕様・設計判断・運用手順・利用方法を残す。作業経緯・実行した検証・結果はPR本文に記載し、`docs/project-notes.md` へのIssueごとの追記は必須としない。必要な説明は該当するドキュメントへ直接反映し、複数PRが同じ開発記録の末尾を編集することによる競合を減らす。既存の記録は保持する。

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

依存関係が必要な検証では `npm ci` でインストールする。実装・設定・テストを変更したPRでは、次の順に確認する。Markdownのみの変更は「調査と検証の範囲」の基準に従う。

1. `npm run format`: 対象ファイルを整形する（書き換えあり）。
2. `npm run lint`: 推奨ルールによる静的解析。警告も失敗として扱う。
3. `npm run format:check`: 整形漏れの検出（書き換えなし）。
4. `npm test`: Astroの型・テンプレート検証、静的ビルド、ページ・公開パスの検証。

`npm run check` と `npm run build` は個別にも実行できる。Biomeは `astro check` の代替ではない。GitHub Actionsでも同じBiomeコマンドを実行する（Issue #9）。

対象は `biome.json` の `files.includes` で管理する。`src/` のAstro・TypeScript・JavaScript・CSS・JSON、`scripts/`、`tests/`、ルートのJSON・MJS設定、および `docs/` の対応形式を検査する。Gitの除外設定も利用し、依存関係・生成物（`node_modules/`、`dist/`、`.astro/`）、自動生成の `package-lock.json`、画像は除外する。

固定バージョンのBiome 2.5.15ではMarkdown・YAMLは非対応のため、`docs/*.md`、README、AGENTS、Actions YAMLは整形・lintされない。ドキュメントの文章・リンク・コード例はレビューで確認する。対応範囲は[Biome公式の言語対応表](https://biomejs.dev/introduction/language-support/)を参照する。

Astroは実験的なHTML全体の解析・整形を有効化している。更新時は差分と `astro check`・ビルド結果を確認する。CSSではTailwind構文を有効化し、別コンポーネント間のセレクターも比較してしまう `noDescendingSpecificity` のみ無効化する。委託販売ページの比較表はキーボードで横スクロールできるようにするため、そのページだけ `noNoninteractiveTabindex` を無効化している。

## フロントエンドCI（Issue #7）

main向けPR（フォークを含む）、mainへのpush、手動実行で `Frontend tests` チェックを確認する。Node.js 22で `npm ci`、`npm test` の順に実行し、Astro/TypeScriptチェック、静的ビルド、Nodeテスト、公開パス検証をすべて行う。

テスト成功後にのみ公開用ビルドとPagesデプロイを実行する。失敗時はActionsの `Frontend tests` ログを確認し、修正をpushして成功を確認する。フォークPRはテストのみで公開しない。PRクローズ時はテストを省略し、既存のプレビュー削除を実行する。

マージ前にPRのChecksで `Frontend tests` の成功を確認する。必須チェックによるマージ制限はワークフローとは別設定であり、管理者がSettings → Rules → Rulesets（またはBranchesの保護ルール）でmainを対象に `Frontend tests` を必須ステータスチェックへ追加する。権限がない場合は管理者へ依頼する。


## BiomeのCI検証（Issue #9）

main向けPR（フォークを含む）、mainへのpush、`workflow_dispatch`による手動実行で、`Biome lint` と `Biome format:check` が実行される。Node.js 22と `npm ci` で固定バージョンを導入し、それぞれ `npm run lint`、`npm run format:check` を実行する。一方が失敗してももう一方のチェックを続行し、両方の結果を確認できる。

PRのChecksで `Frontend tests` に加えて両方のBiomeチェックの成功を確認する。失敗時は該当チェックのActionsログを確認し、lint違反を修正、または `npm run format` で整形してpushする。両Biomeチェックとテストが成功した場合のみ公開用ビルド・Pagesデプロイへ進む。PRクローズ時は検証を省略し、プレビュー削除を実行する。

マージを保護する場合は、mainのルールセットで `Biome lint` と `Biome format:check` も必須ステータスチェックへ追加する。ワークフローだけではマージ操作は制限しない。
