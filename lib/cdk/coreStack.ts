import {
  ArnPrincipal,
  Effect,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
  PolicyDocument
} from "@aws-cdk/aws-iam";
import { HostedZone } from "@aws-cdk/aws-route53";
import { CfnAccount } from "@aws-cdk/aws-apigateway";
import { Certificate, CertificateValidation } from "@aws-cdk/aws-certificatemanager";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

export interface CoreStackParams extends StackProps {
  domainName: string;
  cloudWatchRoleArn?: string;
}

export class CoreStack extends Stack {
  public hostedZone: HostedZone;
  public certificate: Certificate;

  constructor(scope: Construct, id: string, params: CoreStackParams) {
    const { domainName, cloudWatchRoleArn } = params;
    super(scope, id, params);

    const cloudWatchRole = cloudWatchRoleArn
      ? Role.fromRoleArn(this, "ApiGatgewayAccountRole", cloudWatchRoleArn)
      : new Role(this, "ApiGatgewayAccountRole", {
          assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
        });
    cloudWatchRole.attachInlinePolicy(
      new Policy(this, "ApiGatewayLoggingPolicy", {
        policyName: "api-gateway-logging-policy",
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

    this.hostedZone = new HostedZone(this, "HostedZone", {
      zoneName: domainName
    });
    this.certificate = new Certificate(this, "Certificate", {
      domainName,
      validation: CertificateValidation.fromDns(this.hostedZone)
    });
  }
}
