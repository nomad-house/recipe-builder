import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { Runtime } from "@aws-cdk/aws-lambda";
import { getConfig } from "../config";
import { CoreStack, CognitoStack, ServerlessStack, CDNStack } from "../dist/lib/cdk";

export async function buildInfra() {
  const { client, project, stage, env, rootDomain, profile } = await getConfig();
  const prefix = `${client}-${project}-${stage}`;
  const devPort = 4200;
  const callBackPath = "/authorize";
  const logoutPath = "/";

  const app = new App();

  const coreStack = await CoreStack.create(app, "Core", {
    env,
    prefix,
    profile,
    rootDomain,
    certificateArn:
      "arn:aws:acm:us-east-1:141394433500:certificate/a27fc92f-1afc-4ea0-8ac2-3fd528c771cf"
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
  const urls = (frontend.urls ?? []).map(url => `https://${url}`).concat(devAddress);
  const auth = new CognitoStack(app, "Auth", {
    env,
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
    env,
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
    codePath: resolve(__dirname, "..", "dist", "backend"),
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
