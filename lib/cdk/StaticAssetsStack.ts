import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import {
  Certificate,
  DnsValidatedCertificate,
} from "@aws-cdk/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";

export interface StaticAssetsStackParams extends StackProps {
  domainName: string;
  bucketName: string;
  sourcePath: string;
}

export class StaticAssetsStack extends Stack {
  constructor(scope: Construct, id: string, params: StaticAssetsStackParams) {
    super(scope, id, params);
    const { domainName, bucketName, sourcePath } = params;
    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName,
    });
    const destinationBucket = new Bucket(this, "Bucket", {
      bucketName,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    const certificate = new DnsValidatedCertificate(this, "Certificate", {
      domainName,
      hostedZone,
    });
    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      viewerCertificate: {
        aliases: [domainName],
        props: {
          acmCertificateArn: certificate.certificateArn,
          minimumProtocolVersion: "TLSv1.1_2016",
        },
      },
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          s3OriginSource: {
            s3BucketSource: destinationBucket,
            originAccessIdentity,
          },
        },
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: "index.html",
          errorCachingMinTtl: 3600,
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: "index.html",
          errorCachingMinTtl: 3600,
        },
      ],
    });
    new ARecord(this, "AliasRecord", {
      zone: hostedZone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
    new BucketDeployment(this, "BucketDeployment", {
      sources: [Source.asset(sourcePath)],
      destinationBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
