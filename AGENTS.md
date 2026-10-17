## Git worktree と PR

実装依頼（コード、設定、ドキュメント、テストの変更を含む）は、次の手順を必須とする。

1. 最新の `main` を起点に、`codex/<内容を表す短い名前>` ブランチの専用Git worktreeで作業する。
2. `main` の作業ツリーを直接変更・commit・pushしない。
3. 変更に必要なテストを追加・更新し、設計・運用・利用方法に影響する場合は `docs/` を更新する。変更に見合う検証を実行する。
4. 作業ブランチへcommit・pushし、`main` 向けのPull Requestを作成する。
5. ユーザーの明示的な指示がない限り、Pull Requestを自己マージしない。

### AIのタスク完了条件

- 実装依頼には、必要な検証・commit・push・Pull Requestの作成まで含まれる。ユーザーから調査のみ・実装前の認識合わせ・PR不要などの明示的な指定がある場合は、その指定範囲に従う。
- PR作成が依頼範囲に含まれている場合、追加の確認を求めず、実際のPR作成とURLの取得まで完了する。pushやPR作成フォームの表示だけで完了扱いにせず、ユーザーに送信操作を引き継いで終了しない。
- PR作成手段は、実際に作成を完了できるGitHub CLIやAPIを優先する。フォーム表示型のツールを使用する場合は、その操作中の指示に従い、フォーム表示だけをPR作成成功として報告しない。
- 権限不足・認証・ツール制約などでPR作成が完了できない場合は、許可された代替手段を試し、それでも解決できない場合に限り、阻害要因と必要なユーザー操作を明示する。必須の承認・アクセス制御は迂回しない。
- 完了報告には、作成済みPRのURLと検証結果を記載する。マージは別の操作であり、明示的な指示がない限り実行しない。

ユーザーが直接 `main` への反映を明示的に指示した場合のみ例外とする。詳細は [docs/development-workflow.md](docs/development-workflow.md) を参照する。

## 調査・検証の効率

- Issueの受け入れ条件、明記されたファイル、関連テストから調査を始め、必要になった範囲だけ広げる。無関係なファイルや履歴を一括で読み込まない。
- 同じチャット内で確認済みのルール・資料は、内容変更や文脈の不足がなければ再読しない。新しいworktreeでは適用されるルールを確認する。
- 検証は [開発フロー](docs/development-workflow.md) の基準に従う。成功済みの検証は、関連する変更・失敗・未解決の懸念がなければ繰り返さない。`npm test` に含まれる型チェックとビルドを重複実行しない。
- 成功時のログは要点だけ確認し、失敗時に必要な詳細を読む。
- 作業経緯・検証結果はPR本文に記載する。開発記録への毎回の追記は不要とし、`docs/` には今後必要な仕様・運用・利用方法を残す。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
