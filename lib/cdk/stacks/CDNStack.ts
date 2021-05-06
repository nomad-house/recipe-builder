import { Construct, RemovalPolicy } from "@aws-cdk/core";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { CloudFrontWebDistribution, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";
import { BaseStack, BaseStackProps } from "./BaseStack";
import { toKebab, toPascal } from "../../changeCase";

function buildAliases({ stage, rootDomain, buildWwwSubdomain }: CDNStackParams): string[] {
  if (stage === "prod") {
    const aliases = [rootDomain];
    if (buildWwwSubdomain) {
      aliases.push(`www.${rootDomain}`);
    }
    return aliases;
  }
  return [`${toKebab(stage)}.${rootDomain}`];
}

export interface CDNStackParams extends BaseStackProps {
  stage: string;
  rootDomain: string;
  sourcePath: string;
  certificate: Certificate;
  hostedZone: IHostedZone;
  buildWwwSubdomain?: boolean;
}

export class CDNStack extends BaseStack {
  constructor(scope: Construct, id: string, props: CDNStackParams) {
    super(scope, id, props);

    const destinationBucket = new Bucket(this, "Bucket", {
      bucketName: `${this.prefix}-frontend`,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: this.prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
    });

    const aliases = buildAliases(props);

    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      viewerCertificate: {
        aliases,
        props: {
          acmCertificateArn: props.certificate.certificateArn,
          sslSupportMethod: "sni-only",
          minimumProtocolVersion: "TLSv1.2_2018"
        }
      },
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          s3OriginSource: {
            s3BucketSource: destinationBucket,
            originAccessIdentity: new OriginAccessIdentity(this, "OriginAccessIdentity")
          }
        }
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: "/index.html",
          errorCachingMinTtl: 3600
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: "/index.html",
          errorCachingMinTtl: 3600
        }
      ]
    });

    new BucketDeployment(this, "BucketDeployment", {
      sources: [Source.asset(props.sourcePath)],
      destinationBucket,
      distribution,
      distributionPaths: ["/*"]
    });

    for (const alias of aliases) {
      new ARecord(this, `${toPascal(alias)}ARecord`, {
        zone: props.hostedZone,
        recordName: alias,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
      });
    }
  }
}
