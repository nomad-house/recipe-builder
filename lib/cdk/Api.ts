import { Deployment, RestApi, Stage } from "@aws-cdk/aws-apigateway";
import { Construct } from "@aws-cdk/core";
import { BaseConstruct, BaseConstructProps } from "./BaseConstruct";
import { Lambdas } from "./Lambdas";

export interface ApiProps extends BaseConstructProps {
  lambdas: Lambdas;
}

export class Api extends BaseConstruct {
  public restApi: RestApi;
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    this.restApi = new RestApi(this, "RestApi", {
      restApiName: this.prefix
    });
    const deployment = new Deployment(this, "Deployment", {
      api: this.restApi
    });
    new Stage(this, "Stage", {
      stageName: this.prefix,
      deployment
    });

    this.addResources(props.lambdas);
  }

  buildCorsIntegration() {}
}
