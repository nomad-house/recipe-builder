import { Construct } from "@aws-cdk/core";
import { BaseStack, BaseStackProps } from "./BaseStack";
import { Lambdas, LambdasProps } from "../constructs/Lambdas";
import { Tables, TablesProps } from "../constructs/Tables";
import { Api } from "../constructs/Api";
import { IAuthorizer } from "@aws-cdk/aws-apigateway";

export interface ServerlessStackProps
  extends BaseStackProps,
    TablesProps,
    Omit<LambdasProps, "tables"> {
  authorizer?: IAuthorizer;
}

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
      new Api(this, "Api", {
        lambdas,
        prefix: this.prefix,
        authorizer: props.authorizer
      });
    }
  }
}
