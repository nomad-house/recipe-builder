import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { CloudFrontWebDistribution, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { ICertificate, DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";

export interface StaticAssetsStackParams extends StackProps {
  stage: string;
  domainName: string;
  sourcePath: string;
  certificate: ICertificate;
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
  Pick<StaticAssetsStackParams, "stage" | "domainName" | "buildWwwSubdomain">
>;
function buildAlises({ stage, domainName, buildWwwSubdomain }: BuildAliasesParams): string[] {
  if (stage === "prod") {
    const aliases = [domainName];
    if (buildWwwSubdomain) {
      aliases.push(`www.${domainName}`);
    }
    return aliases;
  }
  return [`${urlSafe(stage)}.${domainName}`];
}
export class StaticAssetsStack extends Stack {
  constructor(scope: Construct, id: string, params: StaticAssetsStackParams) {
    super(scope, id, params);
    const {
      stage,
      domainName,
      sourcePath,
      hostedZone,
      certificate,
      buildWwwSubdomain = false
    } = params;

    const aliases = buildAlises({ stage, domainName, buildWwwSubdomain });

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
