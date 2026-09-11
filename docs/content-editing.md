# 本文をMarkdownで編集する

`content/` が公開原稿の正本です。本文を保存して `npm run build` を実行すると `site/index.html` に反映されます。HTMLを直接編集すると次の生成で上書きされます。

| 編集対象 | ファイル |
| --- | --- |
| 冒頭・主張 | content/intro.md |
| 要件との対応 | content/fit.md |
| 志望動機 | content/motivation.md |
| PMと合意形成 | content/collaboration.md |
| 学歴・職歴 | content/experience.md |
| RPA・現場改善・仮説検証 | content/work.md |
| 技術設計・AI開発 | content/engineering.md |
| 案件チャートの説明 | content/projects.md |
| 案件期間・担当・技術 | content/projects.psv |
| 継続中の基準日 | content/projects-config.json |

```powershell
npm run build
# 保存するたびに生成する場合（Ctrl+Cで終了）
npm run watch:content
```

生成後はブラウザを再読み込みしてください。監視中も自動リロードは行いません。
通常のMarkdown（見出し、段落、箇条書き、リンク）を使えます。装飾用HTMLと詳細開閉部分は一部そのまま残しています。`<a id="...">` はページ内リンクの参照先なので維持してください。タイトル・段落は自由に書き換えられます。


## 定性の説明と実績の分け方
各要件セクションで常に表示するのは、見出しと一行のリード文（`<p class="section-lead">`）だけです。本文は開閉パネルに入れ、定性的な説明は「このスキルの詳細」、具体的な実績は「このスキルにまつわる実績」に分けます。どちらも次の形で、詳細 → 実績の順に置きます。

```markdown
<details class="evidence"><summary>このスキルの詳細</summary>
<div class="evidence-body">

#### 小見出し

本文。ここは通常のMarkdownで書けます。

</div>
</details>
```

実績パネルの summary は「このスキルにまつわる実績：<短い説明>」の形にして、開く前に中身が分かるようにします。
`<div class="evidence-body">` の直後に空行を入れてください。空行がないと中身がMarkdownとして解釈されません。見出しは `####`（必要なら `#####`）を使います。
ページ内リンクの参照先 `<a id="...">` は `<details>` の外に置いてください。閉じた状態の中にあるとリンクで飛んでも内容が見えません。

## ガントチャート
`projects.psv` は `期間|案件|技術|担当` の4列。区切りの `|` はセル内で使わないでください。期間は `2025/4–2025/11` または `2025/9–現在` の形式です。開始・終了月を含めて描画し、開始月順に並びます。期間の重複は保持します。稼働量や進捗率ではありません。
`現在` の終点は `projects-config.json` の `asOf` です。自動で今日に伸ばさず、継続状況を確認して基準日を更新してください。チャートの年軸はデータから生成します。

## 公開範囲
`content/` はGit管理・公開原稿用です。非公開原本は `.private/` に置き、公開可の内容だけ転記してください。Markdown中のHTMLも表示されますので、第三者の原稿やスクリプトを無確認で貼り付けないでください。
CDKの通常のcheck・synth・diff・deployスクリプトは生成を先に実行します。
旧 `docs/projects.psv` は過去の転記記録で、編集対象は `content/projects.psv` です。
