import { Construct } from "@aws-cdk/core";
import { Lambdas, LambdasProps } from "../../constructs/Lambdas";
import { Tables, TablesProps } from "../../constructs/Tables";
import { Api, ApiProps } from "../../constructs/Api";
import { BaseConstruct, BaseConstructProps } from "../../constructs/BaseConstruct";

export interface ServerlessConstructProps
  extends BaseConstructProps,
    TablesProps,
    Omit<LambdasProps, "tables">,
    Omit<ApiProps, "lambdas"> {}

export class ServerlessConstruct extends BaseConstruct {
  public lambdas: Lambdas;
  public tables?: Tables;
  public api?: Api;

  constructor(scope: Construct, id: string, props: ServerlessConstructProps) {
    super(scope, id, props);

    if (props.tables) {
      this.tables = new Tables(this, "Tables", props);
    }
    this.lambdas = new Lambdas(this, "Lambdas", {
      ...props,
      tables: this.tables
    });
    if (this.lambdas.apiConfig) {
      this.api = new Api(this, "Api", {
        lambdas: this.lambdas,
        prefix: this.prefix,
        userPool: props.userPool,
        cors: {
          allowOrigins: ["http://localhost:4000"]
        }
      });
    }
  }
}
