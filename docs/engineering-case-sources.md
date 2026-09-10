# 技術事例の出典と表現範囲

2026-09-05：本人の説明と `kawakin-core-system` のローカル資料・CI設定を確認。参照時HEAD：`2f7fa8a703d0d16dea68e135515a4592243bf624`。元リポジトリは変更していない。

## 本人確認済みの設計意図
重要ドメインではコードを読む機会が発生する。コードをSSoTと捉え、コード自体をドキュメントにしたい。そのため、domainとinteractorを読めば業務知識と処理が分かる状態を目指し、コーディング規則とCIで制御している。

## 裏付け
| 掲載内容 | 参照先（元リポジトリ内） |
| --- | --- |
| domainのKnowledge・policy、外部I/O分離、環境依存値の引数化 | api/domain/AGENTS.md：知識（Knowledge）とPolicy |
| 業務分岐のDecision、目的の分かる命名、呼び出し結果の変数化・使用箇所への近接 | api/usecase/interactor/AGENTS.md：規則性（構造） |
| JSON・時刻解釈・Value Object生成をdomain境界へ集約 | 同上、およびapi/domain/AGENTS.md：入力境界・ValueObject・検索条件 |
| domain EntityのValue Object、repository境界、interactorの構造・境界・可読性検査 | .github/workflows/api.yml：lintジョブ、api/Makefile：check-*ターゲット |
| 可読性違反の基準との差分を判定し、新規・増加や縮小未反映を検出 | api/cmd/interactor-readability-audit/main.go、api/internal/interactorreadabilityaudit/baseline.go |

## 表現上の区別
- 独自性はクリーンアーキテクチャの発明ではなく、本人が説明した業務知識の凝縮という意図と具体的な規則への落とし込みとして表す。
- 「2層だけでシステムの全挙動が分かる」とは断定せず、業務知識と手順を読む範囲を絞る設計目標として記載。
- CI設定と監査コードの存在を確認。今回は実行や直近のCI結果、GitHubのブランチ保護設定までは確認していない。
- 全規則違反がゼロ、品質が保証される、レビュー時間や不具合が一定量減ったとは主張しない。
- 本人が規則を作ったという説明と、リポジトリ中の全実装を本人が単独作成したという主張は区別する。
- 顧客名・リポジトリ名・業務固有コードをサイトには掲載せず、一般化した設計方針を紹介する。

## 今後の深掘り候補
- 規則導入前に業務知識が散らばっていた具体例と、導入後にどこを読めば分かるようになったか。
- 一番効果があった規則と、厳しくしすぎて調整した規則。
- 人のレビューやAIによる実装で、実際に確認できた変化。

## コード説明の追加
本人の希望で、現行の複雑なinteractorとdomainから名称を一般化した掲載案を作成。元コードの所在と編集範囲は `validation-ai-columns.md`。2026年2月のZenn記事を背景資料としてリンクし、現行CIと区別。
