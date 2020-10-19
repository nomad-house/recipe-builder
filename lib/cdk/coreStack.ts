import {ArnPrincipal, Effect, Policy, PolicyStatement, Role, ServicePrincipal} from '@aws-cdk/aws-iam';
import {HostedZone} from '@aws-cdk/aws-route53';
import {Certificate, CertificateValidation} from '@aws-cdk/aws-certificatemanager';
import {Construct, Stack, StackProps} from '@aws-cdk/core';

export interface CoreStackParams extends StackProps {
  domainName: string;
}

export class CoreStack extends Stack {
  public hostedZone: HostedZone;
  public certificate: Certificate;

  constructor(scope: Construct, id: string, params: CoreStackParams) {
    const {domainName} = params;
    super(scope, id, params);

    // apigateway account for loggingc

    this.hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName: domainName
    });
    this.certificate = new Certificate(this, 'Certificate', {
      domainName,
      validation: CertificateValidation.fromDns(this.hostedZone)
    });
  }
}
