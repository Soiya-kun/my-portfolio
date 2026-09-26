# my-portfolio
応募に向けた個人ポートフォリオ。公開許可済みの経歴と取り組みを掲載し、<https://seiya-soiya.com> で公開しています。

## 開発
Node.js 22以上を使用します。

```powershell
npm ci
npm run private:init
npm run check
npm run synth
```

`site/index.html` をブラウザで開くと、生成結果をローカルで確認できます。
計画は [docs/plan.md](docs/plan.md)、質問は [docs/intake-template.md](docs/intake-template.md) を参照してください。

## 非公開資料
履歴書の原本、未公開の回答、顧客資料、許諾未確認の画面は `.private/` に保存してください。
`npm run private:init` は回答テンプレートをコピーし、既存回答は上書きしません。
- `.private/` はGit管理外です。バックアップは別途非公開の保管先で管理します。
- 公開可と確認した内容だけを編集・匿名化して `site/` に転記します。
- `.gitignore` は暗号化や既存コミットの削除を行いません。`git add -f` は使用しません。
- `npm run check` は非公開パスのGit追跡を検出します。内容の秘密情報までは判定しません。
- AWS認証はローカルのAWSプロファイル等で管理します。

## 公開
<https://seiya-soiya.com> で公開しています。AWSリソース作成・維持は課金を伴います。

```powershell
npm run diff -- --profile YOUR_PROFILE
npm run deploy -- --profile YOUR_PROFILE
```

CDKは `site/` のみを配信します。非公開S3＋CloudFront OAC＋HTTPS構成です。
スタックは2つあります。`Portfolio`（ap-northeast-1）がS3・CloudFront・Route53レコード、`PortfolioCertificate`（us-east-1）がACM証明書です。CloudFrontの証明書はus-east-1にしか置けないため分けています。`--all` で両方を対象にします。

初回のみ、両リージョンのブートストラップが必要です。

```powershell
npx cdk bootstrap aws://YOUR_ACCOUNT/ap-northeast-1 --profile YOUR_PROFILE
npx cdk bootstrap aws://YOUR_ACCOUNT/us-east-1 --profile YOUR_PROFILE
```

ドメイン `seiya-soiya.com` はRoute53に登録済みで、ホストゾーンも同じアカウントにあります。証明書のDNS検証と、ドメイン直下・`www` のAレコード／AAAAレコードはCDKが作成します。
CI/CDは未設定。削除時にS3は保持されるため、不要になった場合は別途削除が必要です。

## Markdownでの更新
本文は `content/*.md`、レイアウトは `templates/index.html`。`npm run build` で配信HTMLへ反映します。
`npm run watch:content` で保存時に自動生成できます。詳しくは [編集手順](docs/content-editing.md) を参照してください。
