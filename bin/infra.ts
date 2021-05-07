import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { getConfig } from "../config";
import { CoreStack, CognitoStack, ServerlessStack, CDNStack } from "../lib/cdk";

export async function buildInfra() {
  const { client, project, stage, env, rootDomain } = await getConfig();
  const prefix = `${client}-${project}-${stage}`;
  const devPort = 4200;
  const callBackPath = "/authorize";
  const logoutPath = "/";

  const app = new App();

  const coreStack = await CoreStack.create(app, "CoreStack", {
    prefix,
    env,
    rootDomain
  });

  const frontend = new CDNStack(app, "Frontend", {
    env,
    prefix,
    certificate: coreStack.certificate,
    codePaths: [resolve(__dirname, "..", "dist", "frontend")],
    hostedZone: coreStack.hostedZone,
    stage: stage,
    rootDomain: rootDomain
  });

  const devAddress = `http://localhost:${devPort}`;
  const urls = (frontend.urls ?? []).concat(devAddress);
  const auth = new CognitoStack(app, "Cognito", {
    prefix,
    groups: [
      {
        groupName: "admin"
      }
    ],
    userPoolClient: {
      oAuth: {
        callbackUrls: urls.map(url => url + callBackPath ?? ""),
        logoutUrls: urls.map(url => url + logoutPath ?? "")
      }
    }
  });

  new ServerlessStack(app, "Backend", {
    prefix,
    auth,
    frontend,
    cors: {
      allowOrigins: urls
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

  app.synth();
}

buildInfra();
