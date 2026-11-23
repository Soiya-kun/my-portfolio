<h2 id="engineering-title">ソフトウェアアーキテクチャ</h2>

業務上の判断をコードのどこで読めるか、要件の変更をどのテストで確かめられるかを設計します。Goの受託案件では業務ルールと処理手順を整理し、TypeScriptの公開実装ではその考え方を要件定義や画面テストに広げています。

<h3 id="web-app-framework">業務フローをテストとして実行する</h3>

React・Honoで、売上登録から請求の締め・発行、入金管理までを扱う業務Webアプリの土台を作りました。例えば「月次の請求」の業務フローから「入金を記録する」シナリオを開き、その画面操作と、対応するバックエンド処理・SQLまでたどれます。

- **要件とテストをつなぐ。** 業務フロー、担当者、画面操作をTypeScriptで記述し、同じ業務フローをブラウザのE2Eテストとして実行します。個別シナリオの結合テストでは、画面から業務処理までを同一プロセスで動かし、DBを差し替えます。
- **業務の言葉を揃える。** 共通の単語帳から画面の文言を生成し、コードの命名も検査します。静的解析で処理を日本語に変換し、業務フローから実装をたどるブラウザ表示に使います。
- **合意の経緯を追えるようにする。** 議事録の決定事項・課題や、現行業務から新業務への置き換えを、業務フローや画面・処理の定義に関連付けます。

<p class="project-links"><a href="https://github.com/Soiya-kun/web-app-framework">GitHubで実装を見る</a><a href="https://zenn.dev/soiya_kun/articles/4cd62110beebd1">Zennで「TypeSafe要件定義」を読む</a></p>

<h3 id="go-architecture">Goで業務ルールと処理手順の置き場を決める</h3>

Goの業務システムでは、クリーンアーキテクチャを土台に、DDDのValue Objectやポリシーを取り入れました。状態や入力の制約・更新可否は `domain`、処理の順序と外部I/Oの調整は `interactor`、DBへの読み書きは `repository` で扱います。例えば「未提出のデータだけ編集できる」というルールは `domain` に置き、`interactor` を読めば更新の前にどの条件を確かめるかが分かります。

入力境界や呼び出し方、命名などはCIで検査します。AIを使って実装した場合も、設計者が業務上の判断を読む箇所を絞り、DBまで通す自動テストと業務シナリオに沿った操作で振る舞いを確認します。

[ZennでGoの設計事例を読む](https://zenn.dev/digeon/articles/e0e55bc9d18e89)

<details class="evidence" id="ai-development">
<summary>業務判断をコードとCIで確認する例</summary>
<div class="evidence-body">

以下は業務固有の名称を一般化した抜粋です。`interactor` では、対象・バージョン・編集可否を確認する順序が読めます。

<pre tabindex="0" aria-label="interactorのコード例"><code>if err := record.EnsureTargetKind(current); err != nil {
    return nil, err
}
if err := recordupdate.EnsureExpectedVersion(current, selector); err != nil {
    return nil, err
}
if err := record.EnsureVersionEditable(current); err != nil {
    return nil, err
}</code></pre>

`domain` では、編集可否の具体的な条件を確認できます。

<pre tabindex="0" aria-label="domainのコード例"><code>func EnsureVersionEditable(header RecordHeader) error {
    if header.Status.Value() != recordvalue.StatusUnsubmitted {
        return ErrNotEditable
    }
    return nil
}</code></pre>

CIでは、呼び出し直後のエラー処理や入力解釈の位置、業務分岐の書き方を検査します。既存の可読性違反は基準値を記録し、新規追加や件数の増加を検出します。

</div>
</details>
