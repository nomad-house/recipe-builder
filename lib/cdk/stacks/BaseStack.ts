import { Construct, NestedStack, NestedStackProps, Stack, StackProps } from "@aws-cdk/core";
import { toKebab } from "../../changeCase";
import { BaseConstruct } from "../constructs/BaseConstruct";

export interface BaseStackProps extends Omit<StackProps, "env"> {
  prefix: string;
  env: {
    account: string;
    region: string;
  };
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

export interface BaseNestedStackProps extends NestedStackProps {
  prefix: string;
}
export class BaseNestedStack extends NestedStack implements BaseConstruct {
  public prefix: string;
  public prod: boolean;
  constructor(scope: Construct, id: string, props: BaseNestedStackProps) {
    super(scope, id, props);
    this.prefix = toKebab(props.prefix);
    this.prod = this.prefix.split("-").pop() === "prod";
  }
}
