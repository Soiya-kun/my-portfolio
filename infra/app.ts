import * as path from 'node:path';
import { App, Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
// Route53に登録済みの独自ドメイン。ホストゾーンは同じアカウントにある。
const domainName = 'seiya-soiya.com';
const hostedZoneId = 'Z003177531UDFW90F0YMS';
const domainNames = [domainName, `www.${domainName}`];
// アカウントはデプロイ時のプロファイルから取る。リージョンは既存スタックに合わせる。
const account = process.env.CDK_DEFAULT_ACCOUNT;
const app = new App();
const zoneAttrs = { hostedZoneId, zoneName: domainName };
// CloudFrontの証明書はus-east-1にしか置けないため、証明書だけ別スタックにする。
const certStack = new Stack(app, 'PortfolioCertificate', { env: { account, region: 'us-east-1' }, crossRegionReferences: true });
const certificate = new acm.Certificate(certStack, 'SiteCertificate', {
  domainName, subjectAlternativeNames: [`www.${domainName}`],
  validation: acm.CertificateValidation.fromDns(route53.HostedZone.fromHostedZoneAttributes(certStack, 'Zone', zoneAttrs)),
});
const stack = new Stack(app, 'Portfolio', { env: { account, region: 'ap-northeast-1' }, crossRegionReferences: true });
const bucket = new s3.Bucket(stack, 'SiteBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.S3_MANAGED,
  enforceSSL: true, removalPolicy: RemovalPolicy.RETAIN,
});
const distribution = new cf.Distribution(stack, 'Distribution', {
  defaultRootObject: 'index.html',
  domainNames, certificate,
  defaultBehavior: {
    origin: S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    responseHeadersPolicy: cf.ResponseHeadersPolicy.SECURITY_HEADERS,
    compress: true,
  },
});
new BucketDeployment(stack, 'PublishSite', {
  // Upload only reviewed site content, never the repository root.
  sources: [Source.asset(path.join(__dirname, '..', 'site'))],
  destinationBucket: bucket, distribution, distributionPaths: ['/*'],
});
// ドメイン直下とwwwの両方をCloudFrontへ向ける。
const zone = route53.HostedZone.fromHostedZoneAttributes(stack, 'Zone', zoneAttrs);
const target = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
for (const [id, recordName] of [['Apex', undefined], ['Www', 'www']] as const) {
  new route53.ARecord(stack, `${id}Alias`, { zone, recordName, target });
  new route53.AaaaRecord(stack, `${id}AliasIpv6`, { zone, recordName, target });
}
new CfnOutput(stack, 'SiteUrl', { value: `https://${domainName}` });
new CfnOutput(stack, 'DistributionUrl', { value: `https://${distribution.distributionDomainName}` });
