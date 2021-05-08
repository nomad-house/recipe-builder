import { Construct, CustomResource, Environment } from "@aws-cdk/core";
import { Function as Lambda } from "@aws-cdk/aws-lambda";
import { Role, ServicePrincipal, PolicyDocument, Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Lambdas, LambdasProps, LambdaProps } from "../../constructs/Lambdas";
import { Tables, TablesProps } from "../../constructs/Tables";
import { Api, ApiProps } from "../../constructs/Api";
import { BaseConstruct, BaseConstructProps } from "../../constructs/BaseConstruct";
import { AssetCode } from "@aws-cdk/aws-lambda";
import { CDNStack } from "../cdn/CDNStack";
import { CDNNestedStack } from "../cdn/CDNNestedStack";
import { CognitoStack } from "../cognito/CognitoStack";
import { CognitoNestedStack } from "../cognito/CognitoNestedStack";
import { resolve } from "path";

const serviceTokenName = "CUSTOM__RESOURCE";
export interface ServerlessConstructProps
  extends BaseConstructProps,
    TablesProps,
    Omit<LambdasProps, "tables">,
    Omit<ApiProps, "lambdas" | "userPool"> {
  frontend: CDNStack | CDNNestedStack;
  auth?: CognitoStack | CognitoNestedStack;
  configFile?: object;
  env: Required<Environment>;
}

export class ServerlessConstruct extends BaseConstruct {
  public lambdas: Lambdas;
  public tables?: Tables;
  public api?: Api;
  public serviceToken?: Lambda;

  constructor(scope: Construct, id: string, props: ServerlessConstructProps) {
    super(scope, id, props);

    const serviceToken: LambdaProps = {
      functionName: serviceTokenName,
      handler: "index.handler",
      codePath: resolve(__dirname, "..", "..", "..", "providers", "configFileProvider"),
      role: new Role(this, "ServiceTokenRole", {
        roleName: `${props.prefix}-service-token`,
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        inlinePolicies: {
          [`${props.prefix}-service-token`]: new PolicyDocument({
            statements: [
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:PutObject", "s3:DeleteObject"],
                resources: [
                  props.frontend.bucket.bucketArn,
                  props.frontend.bucket.arnForObjects("*")
                ]
              })
            ]
          })
        }
      })
    };

    if (props.tables) {
      this.tables = new Tables(this, "Tables", props);
    }
    this.lambdas = new Lambdas(this, "Lambdas", {
      ...props,
      lambdas: [...props.lambdas, serviceToken],
      tables: this.tables
    });
    this.serviceToken = this.lambdas.resources[serviceTokenName]?.lambda;
    if (this.lambdas.apiConfig) {
      this.api = new Api(this, "Api", {
        lambdas: this.lambdas,
        prefix: this.prefix,
        userPool: props.auth?.userPool,
        cors: {
          allowOrigins: ["http://localhost:4000"]
        }
      });
    }

    if (props.configFile || props.auth || this.api) {
      let config: any = {
        ...(props.configFile || {}),
        region: props.env.region
      };
      if (this.api) {
        config = {
          ...config,
          backendUrl: this.api.restApi.url
        };
      }
      if (props.auth) {
        config = {
          ...config,
          userPool: props.auth.userPool.userPoolId,
          userPoolClient: props.auth.userPoolClient.userPoolClientId,
          identityPool: props.auth.identityPool.ref
        };
      }
      const configFile = new CustomResource(this, "ConfigFile", {
        serviceToken: this.serviceToken.functionArn,
        resourceType: "Custom::ConfigFile",
        properties: {
          config,
          fileType: "js",
          targetBucketName: props.frontend.bucket.bucketName,
          timestamps: Date.now()
        }
      });
      configFile.node.addDependency(this.serviceToken);
    }
  }
}
