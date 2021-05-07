import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { IHostedZone } from "@aws-cdk/aws-route53";
import { Construct } from "@aws-cdk/core";
import { getHostedZoneId } from "../../../aws/route53";
import { BaseNestedStack, BaseNestedStackProps } from "../BaseStack";
import { CoreConstruct, CoreConstructProps } from "./CoreConstruct";

export interface CoreNestedStackProps extends BaseNestedStackProps, CoreConstructProps {}

export class CoreNestedStack extends BaseNestedStack {
  public certificate!: Certificate;
  public hostedZone!: IHostedZone;
  private constructor(scope: Construct, id: string, props: CoreNestedStackProps) {
    super(scope, id, props);
    const { hostedZone, certificate } = new CoreConstruct(scope, "CoreConstruct", props);
    this.certificate = certificate;
    this.hostedZone = hostedZone;
  }
  static async create(scope: Construct, id: string, props: CoreNestedStackProps) {
    let hostedZoneId = props.hostedZoneId;
    if (!hostedZoneId) {
      hostedZoneId = await getHostedZoneId(props.rootDomain);
    }
    return new CoreNestedStack(scope, id, {
      ...props,
      hostedZoneId
    });
  }
}
