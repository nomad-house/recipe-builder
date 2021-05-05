import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { toKebab } from "../changeCase";
import { BaseConstruct } from "./BaseConstruct";

export interface BaseStackProps extends StackProps {
  prefix: string;
}
export class BaseStack extends Stack implements BaseConstruct {
  public prefix: string;
  public prod: boolean;
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);
    this.prefix = toKebab(props.prefix);
    this.prod = this.prefix.split("-").pop() === "prod";
  }
}
