import { Construct } from "@aws-cdk/core";
import { toKebab } from "lib/rename";

export interface BaseConstructProps {
  prefix: string;
}

export abstract class BaseConstruct extends Construct {
  protected prefix: string;
  protected prod: boolean;
  constructor(scope: Construct, id: string, props: BaseConstructProps) {
    super(scope, id);
    this.prefix = toKebab(props.prefix);
    this.prod = this.prefix.split("-").pop() === "prod";
  }
}
