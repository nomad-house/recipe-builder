import { Construct } from "@aws-cdk/core";
import { AssetCode, LayerVersion } from "@aws-cdk/aws-lambda";
import {
  toPascal,
  toKebab,
  DynamoDefinition,
  LambdaDefinition,
  LogLevel,
  LayerDefinition
} from "../../lib";
import { DynamoTables } from "./DynamoTables";
import { LambdasAndLogGroups } from "./LambdasAndLogGroups";
import { Api } from "./Api";
import { Vpc } from "@aws-cdk/aws-ec2";
import { IUserPool } from "@aws-cdk/aws-cognito";
import { IRestApi } from "@aws-cdk/aws-apigateway";

export interface ServerlessBaseProps {
  client: string;
  projectName: string;
  stage: string;
  connectInstanceId: string;
  env: {
    account: string;
    region: string;
  };
  lambdaAlias?: string;
  lambdaTimeout?: number;
  lambdaLoggingLevel?: LogLevel;
  provisionedConcurrency?: number;
  tables?: DynamoDefinition[];
  lambdas?: LambdaDefinition[];
  layer?: LayerDefinition;
  code?: string;
  vpc?: Vpc;
  userPool?: IUserPool;
  allowedOrigins?: string[];
}
export class ServerlessBase extends Construct {
  public prefix: string;
  public api?: IRestApi;
  public lambdas?: LambdasAndLogGroups;

  private projectName: string; // kebab-cased project name
  private ProjectName: string; // PascalCased project name
  private stage: string; // kebab-cased stage name
  private Stage: string; // PascalCased stage name
  private tables?: DynamoTables;
  private layer?: LayerVersion;

  constructor(scope: Construct, id: string, props: ServerlessBaseProps) {
    super(scope, id);

    this.projectName = toKebab(props.projectName);
    this.ProjectName = toPascal(this.projectName);
    this.stage = toKebab(props.stage || "dev");
    this.Stage = toPascal(this.stage);
    this.prefix = `${props.client}-${this.projectName}-${this.stage}`;
    if (props.tables) {
      this.tables = new DynamoTables(this, this.ProjectName + "DynamoTables", {
        prefix: this.prefix,
        definitions: props.tables
      });
    }
    if (props.layer) {
      this.layer = new LayerVersion(this, this.ProjectName + "LambdaLayer", {
        layerVersionName: this.prefix,
        code: new AssetCode(props.layer.folderPath),
        compatibleRuntimes: props.layer.compatibleRuntimes
      });
    }
    if (props.lambdas) {
      if (!props.code) {
        throw new Error("when building lambdas, must provide an absolute path to the code folder");
      }
      this.lambdas = new LambdasAndLogGroups(this, this.ProjectName + "LambdasAndLogGroups", {
        prefix: this.prefix,
        code: props.code,
        layer: this.layer,
        tables: this.tables,
        lambdas: props.lambdas,
        connectInstanceId: props.connectInstanceId,
        vpc: props.vpc,
        lambdaTimeout: props.lambdaTimeout
      });
    }
    if (this.lambdas?.apiResources) {
      const { api } = new Api(this, "Api", {
        env: props.env,
        stage: this.stage,
        Stage: this.Stage,
        projectName: this.projectName,
        ProjectName: this.ProjectName,
        lambdas: this.lambdas,
        connectInstanceId: props.connectInstanceId,
        userPool: props.userPool,
        allowedOrigins: props.allowedOrigins
      });
      this.api = api;
    }
  }
}
