import { Construct } from "@aws-cdk/core";
import { BaseStack, BaseStackProps } from "./BaseStack";
import { Lambdas, LambdasProps } from "./Lambdas";
import { Tables, TablesProps } from "./Tables";

export interface ServerlessStackProps
  extends BaseStackProps,
    TablesProps,
    Omit<LambdasProps, "tables"> {}

export class ServerlessStack extends BaseStack {
  public tables?: Tables;
  public lambdaResources: Lambdas["resources"];
  constructor(scope: Construct, id: string, props: ServerlessStackProps) {
    super(scope, id, props);

    if (props.tables) {
      this.tables = new Tables(this, "Tables", props);
    }
    const lambdas = new Lambdas(this, "Lambdas", {
      ...props,
      tables: this.tables
    });
    this.lambdaResources = lambdas.resources;
    if (lambdas.apiConfig) {
    }
  }
}
