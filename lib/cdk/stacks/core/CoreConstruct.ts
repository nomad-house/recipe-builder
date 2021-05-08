import { HostedZone, HostedZoneProps, IHostedZone } from "@aws-cdk/aws-route53";
import {
  Certificate,
  CertificateProps,
  CertificateValidation,
  ICertificate
} from "@aws-cdk/aws-certificatemanager";
import { Construct } from "@aws-cdk/core";
import { BaseConstruct, BaseConstructProps } from "../../constructs/BaseConstruct";

export interface CoreConstructProps
  extends BaseConstructProps,
    Partial<HostedZoneProps>,
    Partial<Omit<CertificateProps, "domainName">> {
  rootDomain: string;
  includeSubdomains?: boolean;
  hostedZoneId?: string;
  certificateArn?: string;
}

export class CoreConstruct extends BaseConstruct {
  public hostedZone: IHostedZone;
  public certificate: ICertificate;

  constructor(scope: Construct, id: string, props: CoreConstructProps) {
    super(scope, id, props);
    const { rootDomain, hostedZoneId, certificateArn } = props;

    this.hostedZone = hostedZoneId
      ? HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
          hostedZoneId,
          zoneName: rootDomain
        })
      : new HostedZone(this, "HostedZone", {
          zoneName: rootDomain
        });

    const subjectAlternativeNames = props.subjectAlternativeNames ?? [];
    if (props.includeSubdomains) {
      subjectAlternativeNames.push(`*.${rootDomain}`);
    }

    this.certificate = certificateArn
      ? Certificate.fromCertificateArn(this, "Certificate", certificateArn)
      : new Certificate(this, "Certificate", {
          domainName: rootDomain,
          subjectAlternativeNames,
          validation: CertificateValidation.fromDns(this.hostedZone)
        });
  }
}
