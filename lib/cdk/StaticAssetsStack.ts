import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { CloudFrontWebDistribution, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Certificate, DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";

export interface StaticAssetsStackParams extends StackProps {
  stage: string;
  rootDomain: string;
  sourcePath: string;
  certificate: Certificate;
  hostedZone: IHostedZone;
  buildWwwSubdomain?: boolean;
}

function urlSafe(stage: string): string {
  return stage
    .replace(/^a-zA-Z/, "-")
    .split("-")
    .filter(seg => seg !== "")
    .join("-")
    .toLowerCase();
}
type BuildAliasesParams = Required<
  Pick<StaticAssetsStackParams, "stage" | "rootDomain" | "buildWwwSubdomain">
>;
function buildAlises({ stage, rootDomain, buildWwwSubdomain }: BuildAliasesParams): string[] {
  if (stage === "prod") {
    const aliases = [rootDomain];
    if (buildWwwSubdomain) {
      aliases.push(`www.${rootDomain}`);
    }
    return aliases;
  }
  return [`${urlSafe(stage)}.${rootDomain}`];
}
export class StaticAssetsStack extends Stack {
  private prod: boolean;
  constructor(scope: Construct, id: string, params: StaticAssetsStackParams) {
    super(scope, id, params);
    const {
      stage,
      rootDomain,
      sourcePath,
      hostedZone,
      certificate,
      buildWwwSubdomain = false
    } = params;
    this.prod = stage === "prod";

    const aliases = buildAlises({ stage, rootDomain, buildWwwSubdomain });
    // aliases[0] should contain either example.com or some-branch.example.com
    const destinationBucket = new Bucket(this, "Bucket", {
      bucketName: aliases[0].replace(".", "-").toLowerCase(),
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    });

    const originAccessIdentity = new OriginAccessIdentity(this, "OriginAccessIdentity");

    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      viewerCertificate: {
        aliases,
        props: {
          acmCertificateArn: certificate.certificateArn,
          sslSupportMethod: "sni-only",
          minimumProtocolVersion: "TLSv1.2_2018"
        }
      },
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          s3OriginSource: {
            s3BucketSource: destinationBucket,
            originAccessIdentity
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
      sources: [Source.asset(sourcePath)],
      destinationBucket,
      distribution,
      distributionPaths: ["/*"]
    });

    for (const alias of aliases) {
      new ARecord(this, `${urlSafe(alias)}AliasRecord`, {
        zone: hostedZone,
        recordName: alias,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
      });
    }
  }
}
