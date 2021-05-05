import { FunctionProps, Function as Lambda, IEventSource } from "@aws-cdk/aws-lambda";
import { LogGroup, LogGroupProps } from "@aws-cdk/aws-logs";
import { IRole, Role, Policy, PolicyStatement, Effect, ServicePrincipal } from "@aws-cdk/aws-iam";
import { Construct, RemovalPolicy } from "@aws-cdk/core";
import { Tables } from "./Tables";
import { toPascal, toUpperSnake } from "../changeCase";
import { BaseConstruct, BaseConstructProps } from "./BaseConstruct";

const methods = ["GET", "POST", "PATCH", "PUT", "DELETE"] as const;
type Method = typeof methods[number];
function isMethod(value: any): value is Method {
  return typeof value === "string" && !!methods.find(value.toUpperCase() as any);
}
export interface ApiEvent {
  method: Method;
  path: string;
}
interface ApiConfig extends ApiEvent {
  lambda: Lambda;
}
export function isApiEvent(event: any): event is ApiEvent {
  if (typeof event !== "object") {
    return false;
  }
  for (const [key, value] of Object.entries(event)) {
    switch (key) {
      case "method":
        if (!isMethod(value)) {
          throw new Error(`${value} is not a valid METHOD`);
        }
        break;
      case "path":
        if (typeof value === "string" && value.startsWith("/")) {
          break;
        }
        throw new Error('ApiEvent paths must be of type string and start with a "/"');
      default:
        return false;
    }
  }
  return true;
}
interface TableDetail {
  tableName: string;
  read?: boolean;
  write?: boolean;
}
export interface LambdaProps
  extends Omit<FunctionProps, "code" | "runtime" | "events">,
    LogGroupProps {
  functionName: string;
  policyStatements?: PolicyStatement[];
  tables?: (string | TableDetail)[];
  code?: FunctionProps["code"];
  runtime?: FunctionProps["runtime"];
  canInvoke?: IRole[];
  events?: (ApiEvent | IEventSource)[];
}
const omittedProps = ["functionName", "logGroupName", "description", "tables", "handler"] as const;
type OmittedProps = typeof omittedProps[number];
export interface LambdasProps extends BaseConstructProps, Omit<LambdaProps, OmittedProps> {
  lambdas: LambdaProps[];
  tables?: Tables;
}
interface ResourceGroup {
  lambda: Lambda;
  logGroup: LogGroup;
  role: Role;
}
export class Lambdas extends BaseConstruct {
  public resources: { [functionName: string]: ResourceGroup } = {};
  public apiConfig?: { [functionName: string]: ApiConfig };
  private tables?: Tables["tables"];

  constructor(scope: Construct, id: string, private props: LambdasProps) {
    super(scope, id, props);
    this.tables = props.tables?.tables;
    for (const lambda of props.lambdas) {
      this.buildResources(lambda);
    }
  }

  buildResources(props: LambdaProps) {
    const functionName = `${this.prefix}-${props.functionName}`.substr(0, 64);
    const removalPolicy = props.removalPolicy ?? this.props.removalPolicy;
    const logGroup = new LogGroup(
      this,
      `${toPascal(props.logGroupName ?? props.functionName)}LogGroup`,
      {
        logGroupName: `/aws/lambda/${functionName}`,
        retention: props.retention ?? this.props.retention,
        encryptionKey: props.encryptionKey ?? this.props.encryptionKey,
        removalPolicy: removalPolicy
          ? removalPolicy
          : this.prod
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY
      }
    );

    const role = this.buildIam({ props, logGroup, functionName });

    const code = props.code ?? this.props.code;
    if (!code) {
      throw new Error(`no code provided for ${props.functionName}`);
    }
    const runtime = props.runtime ?? this.props.runtime;
    if (!runtime) {
      throw new Error(`no runtime provided for ${props.functionName}`);
    }
    const lambda = new Lambda(this, `${toPascal(props.functionName)}Lambda`, {
      ...this.props,
      ...props,
      runtime,
      code,
      role,
      functionName,
      events: undefined
    });

    const layers = props.layers ?? this.props.layers ?? [];
    for (const layer of layers) {
      if (layer?.compatibleRuntimes?.filter(rt => rt.runtimeEquals(runtime))) {
        lambda.addLayers(layer);
      }
    }

    lambda.node.addDependency(role);

    if (props.tables?.length) {
      if (!this.tables) {
        throw new Error("no Tables passed to Lambdas");
      }
      for (const nameOrDetail of props.tables) {
        const name = typeof nameOrDetail === "string" ? nameOrDetail : nameOrDetail.tableName;
        if (!this.tables[name]) {
          throw new Error(
            `failed adding table privileges for function ${props.functionName}.\ntable ${name} doesn't exist`
          );
        }

        props.tables.length === 1
          ? lambda.addEnvironment("TABLE_NAME", this.tables[name].tableName)
          : lambda.addEnvironment(
              `${toUpperSnake(this.tables[name].tableName)}_TABLE_NAME`,
              this.tables[name].tableName
            );

        if (typeof nameOrDetail === "string") {
          this.tables[name].grantReadWriteData(lambda);
          continue;
        }
        const { read, write } = nameOrDetail;
        if (read) {
          this.tables[name].grantReadData(lambda);
        }
        if (write) {
          this.tables[name].grantWriteData(lambda);
        }
      }
    }

    if (props.events?.length) {
      for (const event of props.events) {
        if (isApiEvent(event)) {
          if (!this.apiConfig) {
            this.apiConfig = {};
          }
          this.apiConfig[props.functionName] = {
            lambda,
            method: event.method,
            path: event.path
          };
          continue;
        }
        lambda.addEventSource(event);
      }
    }

    const canInvoke = [...(props.canInvoke || []), ...(this.props.canInvoke || [])];
    if (canInvoke.length) {
      for (const invokeRole of canInvoke) {
        invokeRole.attachInlinePolicy(
          new Policy(this, toPascal(`${invokeRole.roleName}-${props.functionName}`), {
            statements: [
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["lambda:InvokeFunction"],
                resources: [lambda.functionArn]
              })
            ]
          })
        );
      }
    }

    this.resources[props.functionName] = {
      lambda,
      logGroup,
      role
    };
  }

  buildIam({
    functionName,
    logGroup,
    props
  }: {
    functionName: string;
    logGroup: LogGroup;
    props: LambdaProps;
  }): Role {
    const truncatedName = functionName.substr(0, 64);
    const role = new Role(this, `${toPascal(props.functionName)}Role`, {
      roleName: truncatedName,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com")
    });

    logGroup.grantWrite(role);

    if (props.policyStatements?.length) {
      props.policyStatements.forEach(statement => role.addToPolicy(statement));
    }

    if (props.vpc) {
      role.addToPolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "ec2:CreateNetworkInterface",
            "ec2:DescribeNetworkInterfaces",
            "ec2:DeleteNetworkInterface",
            "ec2:AssignPrivateIpAddresses",
            "ec2:UnassignPrivateIpAddresses"
          ],
          resources: ["*"]
        })
      );
    }

    return role;
  }
}
