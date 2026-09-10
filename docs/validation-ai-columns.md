# 仮説検証・AI開発・コラムの掲載記録

2026-09-05 本人の追加説明に基づく仮掲載。

## 仮説検証
- 船舶系UX：A変更→担当者への連絡→B再計算の流れに、自動連携の可能性を見出した。ToBe策定で自動連携パターンを列挙し、draw.ioで作図・プレゼン。利用者からの反応、実装完了、具体的日数や効果は未提供なので補わない。
- フリーフォーム：入力と承認を抽象化して現場で使い、汎用機能からはみ出す仕事を観察。備品発注では基幹マスタと最終手入力を発見し、個別フォームの要件を固め最終実装。具体的なAPI連携方式や削減量は推測しない。

## AI開発
本人の設計、規則とCI、動作確認、重要なdomain/interactorの読解を中心に記載。AIと人の作成行数や自動化率は未確認。
参照記事：https://zenn.dev/digeon/articles/e0e55bc9d18e89 （2026-02-11公開、2026-09-05閲覧）。記事は設計背景の公開資料としてリンクし、現行規則とは区別する。

### コード掲載案の由来
参照元：C:/Users/djmaa/IdeaProjects/kawakin-core-system
- api/usecase/interactor/budget_detail_general_affairs.go：UpsertGeneralAffairsBudgetDetailsのpolicy呼び出し3件（56〜64行付近）。名称を一般化、前後の処理を省略。
- api/domain/budget/version_policy.go：EnsureVersionEditable（89行付近）。型・フィールド・定数・エラー名を一般化。
- .github/workflows/api.yml：4つのcheck-*呼び出しを確認。
- api/cmd/interactor-readability-audit/main.go、api/internal/interactorreadabilityaudit/baseline.go：既存違反との比較と非ゼロ終了を確認。

掲載コードは実コードそのままではなく、名称変更を伴う説明用抜粋。コンパイル可能なサンプルや実際のBefore/Afterとは称さない。元の複雑な関数全体が全規則に準拠するとは断定しない。CIの最新実行結果・必須チェック設定は未確認。顧客名や元コードの業務固有名をサイトへ転記しない。
画面や動画の追加に代えて、当面は事例本文・コード説明・公開記事を提示する。独立した実証や成果測定が得られたとは扱わない。

## コラム
以下のタイトルのみ本人指定。本文は本人が後日執筆する。本文・要約・主張は作成せず、リンクのない執筆予定一覧として掲載。
- システム開発の営みはキングダムだ
- プロジェクト運営の顧客折衝は将棋みたいな側面がある
- 株式市場はキングダムだ
