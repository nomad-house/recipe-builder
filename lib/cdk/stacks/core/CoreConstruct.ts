import { HostedZone, HostedZoneProps, IHostedZone } from "@aws-cdk/aws-route53";
import {
  Certificate,
  CertificateProps,
  CertificateValidation
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
  cloudWatchRoleArn?: string;
}

export class CoreConstruct extends BaseConstruct {
  public hostedZone: IHostedZone;
  public certificate: Certificate;

  constructor(scope: Construct, id: string, props: CoreConstructProps) {
    super(scope, id, props);
    const { rootDomain, hostedZoneId } = props;

    this.hostedZone = hostedZoneId
      ? HostedZone.fromHostedZoneId(this, "HostedZone", hostedZoneId)
      : new HostedZone(this, "HostedZone", {
          zoneName: rootDomain
        });

    const subjectAlternativeNames = props.subjectAlternativeNames ?? [];
    if (props.includeSubdomains) {
      subjectAlternativeNames.push(`*.${rootDomain}`);
    }
    this.certificate = new Certificate(this, "Certificate", {
      domainName: rootDomain,
      subjectAlternativeNames,
      validation: CertificateValidation.fromDns(this.hostedZone)
    });
  }
}
