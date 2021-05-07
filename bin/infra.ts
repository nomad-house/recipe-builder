import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { getConfig } from "../config";
import { CoreStack, CognitoStack, ServerlessStack, CDNStack } from "../lib/cdk";

export async function buildInfra() {
  const { client, project, stage, env, rootDomain } = await getConfig();
  const prefix = `${client}-${project}-${stage}`;

  const app = new App();

  const coreStack = await CoreStack.create(app, "CoreStack", {
    prefix,
    env,
    rootDomain
  });

  const auth = new CognitoStack(app, "Cognito", {
    prefix,
    groups: [
      {
        groupName: "admin"
      }
    ]
  });

  const backend = new ServerlessStack(app, "Backend", {
    prefix,
    userPool: auth.userPool,
    cors: {
      allowOrigins: ["http://localhost:4200"]
    },
    tables: [
      {
        tableName: "demo-table",
        partitionKey: {
          id: "string"
        }
      }
    ],
    runtime: Runtime.NODEJS_14_X,
    code: new AssetCode(resolve(__dirname, "..", "dist", "backend")),
    lambdas: [
      {
        functionName: "demo-function",
        handler: "demoFunction.handler",
        tables: ["demo-table"],
        events: [
          {
            method: "GET",
            path: "/"
          }
        ]
      }
    ]
  });

  const frontend = new CDNStack(app, "Frontend", {
    env,
    prefix,
    codePaths: [resolve(__dirname, "..", "dist", "frontend")],
    hostedZone: coreStack.hostedZone,
    stage: stage,
    rootDomain: rootDomain
  });

  app.synth();
}

buildInfra();
