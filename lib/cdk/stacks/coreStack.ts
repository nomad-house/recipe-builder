import {
  ArnPrincipal,
  Effect,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
  PolicyDocument
} from "@aws-cdk/aws-iam";
import { HostedZone, IHostedZone } from "@aws-cdk/aws-route53";
import { CfnAccount } from "@aws-cdk/aws-apigateway";
import { Certificate, CertificateValidation } from "@aws-cdk/aws-certificatemanager";
import { CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";

export interface CoreStackParams extends StackProps {
  rootDomain: string;
  hostedZoneId?: string;
  cloudWatchRoleArn?: string;
}

export class CoreStack extends Stack {
  public hostedZone: IHostedZone;
  public certificate: Certificate;

  constructor(scope: Construct, id: string, params: CoreStackParams) {
    const { rootDomain, cloudWatchRoleArn, hostedZoneId } = params;
    super(scope, id, params);

    const cloudWatchRole = cloudWatchRoleArn
      ? Role.fromRoleArn(this, "ApiGatgewayAccountRole", cloudWatchRoleArn)
      : new Role(this, "ApiGatgewayAccountRole", {
          roleName: `api-gateway-account-role`,
          assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
        });
    cloudWatchRole.attachInlinePolicy(
      new Policy(this, "ApiGatewayLoggingPolicy", {
        policyName: "api-gateway-account-logging-policy",
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
            resources: ["*"]
          })
        ]
      })
    );
    if (!cloudWatchRoleArn) {
      new CfnAccount(this, "ApiGatewayAccount", { cloudWatchRoleArn: cloudWatchRole.roleArn });
    }

    this.hostedZone = hostedZoneId
      ? HostedZone.fromHostedZoneId(this, "HostedZone", hostedZoneId)
      : new HostedZone(this, "HostedZone", {
          zoneName: rootDomain
        });

    this.certificate = new Certificate(this, "Certificate", {
      domainName: rootDomain,
      subjectAlternativeNames: [`*.${rootDomain}`],
      validation: CertificateValidation.fromDns(this.hostedZone)
    });
  }
}
