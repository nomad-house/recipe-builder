import { ICertificate } from "@aws-cdk/aws-certificatemanager";
import { IHostedZone } from "@aws-cdk/aws-route53";
import { Construct } from "@aws-cdk/core";
import { getHostedZoneId } from "../../../aws/route53";
import { BaseStack, BaseStackProps } from "../BaseStack";
import { CoreConstruct, CoreConstructProps } from "./CoreConstruct";

export interface CoreStackProps extends BaseStackProps, CoreConstructProps {
  profile: string;
}

export class CoreStack extends BaseStack {
  public certificate!: ICertificate;
  public hostedZone!: IHostedZone;
  private constructor(scope: Construct, id: string, props: CoreStackProps) {
    super(scope, id, { ...props, stackName: props.stackName ?? `${props.prefix}-core` });
    const { hostedZone, certificate } = new CoreConstruct(this, "CoreConstruct", props);
    this.certificate = certificate;
    this.hostedZone = hostedZone;
  }
  static async create(scope: Construct, id: string, props: CoreStackProps) {
    let hostedZoneId = props.hostedZoneId;
    if (!hostedZoneId) {
      hostedZoneId = await getHostedZoneId({
        rootDomain: props.rootDomain,
        region: props.env.region,
        profile: props.profile
      });
    }
    return new CoreStack(scope, id, {
      ...props,
      hostedZoneId
    });
  }
}
