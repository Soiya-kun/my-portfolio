# 本文をMarkdownで編集する

`content/` が公開原稿の正本です。本文を保存して `npm run build` を実行すると `site/index.html` に反映されます。HTMLを直接編集すると次の生成で上書きされます。

| 編集対象 | ファイル |
| --- | --- |
| プロフィール・冒頭 | content/intro.md |
| PM経験・合意形成 | content/collaboration.md |
| アーキテクチャ・公開実装・関連記事 | content/engineering.md |
| 学歴・職歴 | content/experience.md |
| 案件チャートの説明 | content/projects.md |
| 案件期間・担当・技術 | content/projects.psv |
| 継続中の基準日 | content/projects-config.json |

```powershell
npm run build
# 保存するたびに生成する場合（Ctrl+Cで終了）
npm run watch:content
```

監視中も自動リロードは行われないため、生成後にブラウザを再読み込みしてください。表示する原稿とセクションの順序は `templates/index.html` で指定します。各セクションの見出しやリンク先の `id` を変更するときは、対応する `aria-labelledby` やページ内リンクも更新してください。

## ガントチャート

`projects.psv` は `期間|案件|技術|担当` の4列です。セル内には区切りの `|` を使わないでください。期間は `2025/4–2025/11` または `2025/9–現在` の形式です。開始・終了月を含めて描画し、開始月順に並びます。期間の重複は保持します。

`現在` の終点は `projects-config.json` の `asOf` です。継続状況を確認して基準日を更新してください。チャートの年軸はデータから生成します。

## 公開範囲

非公開原本は `.private/` に置き、公開可の内容を `content/` に転記してください。Markdown内のHTMLも表示されます。顧客資料、顧客を特定できるコードや画面を扱う場合は、公開範囲を確認してください。

CDKのcheck・synth・diff・deployスクリプトは生成を先に実行します。旧 `docs/projects.psv` は過去の転記記録です。案件の編集には `content/projects.psv` を使ってください。
