import { StackProps, Stack, Construct } from "@aws-cdk/core";
import { Api } from "../../constructs/Api";
import { Lambdas } from "../../constructs/Lambdas";
import { Tables } from "../../constructs/Tables";
import { ServerlessConstruct, ServerlessConstructProps } from "./ServerlessConstruct";

export interface ServerlessStackProps extends Omit<StackProps, "env">, ServerlessConstructProps {}

export class ServerlessStack extends Stack {
  public lambdas: Lambdas;
  public tables?: Tables;
  public api?: Api;

  constructor(scope: Construct, id: string, props: ServerlessStackProps) {
    super(scope, id, { ...props, stackName: props.stackName ?? `${props.prefix}-serverless` });
    const { lambdas, tables, api } = new ServerlessConstruct(this, "ServerlessConstruct", props);
    this.lambdas = lambdas;
    this.tables = tables;
    this.api = api;
  }
}
