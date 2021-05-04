import {
  FunctionProps,
  Function as Lambda,
  IEventSource,
  Code,
  AssetCode
} from "@aws-cdk/aws-lambda";
import { LogGroup, LogGroupProps } from "@aws-cdk/aws-logs";
import { IRole, Role, Policy, PolicyStatement, Effect, ServicePrincipal } from "@aws-cdk/aws-iam";
import { Construct, RemovalPolicy } from "@aws-cdk/core";
import { Tables } from "./Tables";
import { toPascal, toUpperSnake } from "lib/rename";
import { BaseConstruct, BaseConstructProps } from "./BaseConstruct";
import { Mutable } from "lib/Mutable";

interface TableDetail {
  tableName: string;
  read?: boolean;
  write?: boolean;
}
export interface LambdaProps extends Omit<FunctionProps, "code" | "runtime">, LogGroupProps {
  functionName: string;
  policyStatements?: PolicyStatement[];
  tables?: string | TableDetail[];
  code?: FunctionProps["code"];
  runtime?: FunctionProps["runtime"];
  canInvoke?: IRole[];
}
const omittedProps = ["functionName", "logGroupName", "description", "tables"] as const;
type OmittedProps = typeof omittedProps[number];
export interface LambdasProps extends BaseConstructProps, Omit<LambdaProps, OmittedProps> {
  lambdas: LambdaProps[];
  tables?: Tables;
}
interface ResourceGroup {
  lambda: Lambda;
  logGroup: LogGroup;
  role: Role;
  policy: Policy;
}
export class Lambdas extends BaseConstruct {
  public resources: { [functionName: string]: ResourceGroup } = {};
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

    const { role, policy } = this.buildIam({ props, logGroup, functionName });

    if (!(props.code && this.props.code)) {
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
      code: props.code ?? this.props.code,
      role,
      functionName
    });

    const layers = props.layers ?? this.props.layers ?? [];
    for (const layer of layers) {
      if (layer?.compatibleRuntimes?.filter(rt => rt.runtimeEquals(runtime))) {
        lambda.addLayers(layer);
      }
    }

    policy.node.addDependency(role);
    lambda.node.addDependency(policy);

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
      role,
      policy
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
  }): { role: Role; policy: Policy } {
    const truncatedName = functionName.substr(0, 64);
    const role = new Role(this, `${toPascal(props.functionName)}Role`, {
      roleName: truncatedName,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com")
    });
    const policy = new Policy(this, `${toPascal(props.functionName)}Policy`, {
      policyName: truncatedName,
      roles: [role]
    });

    logGroup.grantWrite(role);

    if (props.policyStatements?.length) {
      policy.addStatements(...props.policyStatements);
    }

    if (props.vpc) {
      policy.addStatements(
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

    return {
      role,
      policy
    };
  }
}
