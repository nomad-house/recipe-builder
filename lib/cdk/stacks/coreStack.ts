import { HostedZone, HostedZoneProps, IHostedZone } from "@aws-cdk/aws-route53";
import {
  Certificate,
  CertificateProps,
  CertificateValidation
} from "@aws-cdk/aws-certificatemanager";
import { Construct } from "@aws-cdk/core";
import { BaseStack, BaseStackProps } from "./BaseStack";
import { getHostedZoneId } from "../../aws/route53";

export interface CoreStackProps
  extends BaseStackProps,
    Partial<HostedZoneProps>,
    Partial<Omit<CertificateProps, "domainName">> {
  rootDomain: string;
  includeSubdomains?: boolean;
  hostedZoneId?: string;
  cloudWatchRoleArn?: string;
}

export class CoreStack extends BaseStack {
  public hostedZone: IHostedZone;
  public certificate: Certificate;

  private constructor(scope: Construct, id: string, props: CoreStackProps) {
    const { rootDomain, hostedZoneId } = props;
    super(scope, id, props);

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

  static async create(scope: Construct, id: string, props: CoreStackProps): Promise<CoreStack> {
    let hostedZoneId = props.hostedZoneId;
    if (!hostedZoneId) {
      hostedZoneId = await getHostedZoneId(props.rootDomain);
    }
    return new CoreStack(scope, id, {
      ...props,
      hostedZoneId,
      stackName: `${props.prefix}-core`
    });
  }
}
