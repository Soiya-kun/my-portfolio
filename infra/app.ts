import * as path from 'node:path';
import { App, Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
const app = new App();
const stack = new Stack(app, 'Portfolio');
const bucket = new s3.Bucket(stack, 'SiteBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.S3_MANAGED,
  enforceSSL: true, removalPolicy: RemovalPolicy.RETAIN,
});
const distribution = new cf.Distribution(stack, 'Distribution', {
  defaultRootObject: 'index.html',
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
new CfnOutput(stack, 'SiteUrl', { value: `https://${distribution.distributionDomainName}` });
