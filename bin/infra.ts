import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { ServerlessStack } from "../lib/cdk/stacks/ServerlessStack";
import { getConfig } from "../config";
import { AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { CoreStack } from "../lib/cdk/stacks/coreStack";
import { Cognito } from "../lib/cdk/stacks/Cognito";
import { CognitoUserPoolsAuthorizer } from "@aws-cdk/aws-apigateway";

export async function buildInfra() {
  const config = await getConfig();
  const prefix = `${config.client}-${config.project}-${config.stage}`;

  const app = new App();

  const coreStack = await CoreStack.create(app, "CoreStack", {
    prefix,
    env: config.env,
    rootDomain: "CODEified.org"
  });

  const auth = new Cognito(app, "Cognito", {
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

  // const groups = ["admin"] as const;
  // const auth = new AuthStack<typeof groups>(app, "AuthStack", {
  //   prefix,
  //   groups
  // });

  // new StaticAssetsStack(app, "FrontendStack", {
  //   stackName: `${project}-frontend-${stage}`,
  //   env,
  //   stage,
  //   rootDomain,
  //   sourcePath: resolve(__dirname, "..", "client", "dist"),
  //   hostedZone: coreStack.hostedZone,
  //   certificate: coreStack.certificate,
  //   buildWwwSubdomain: true
  // });

  app.synth();
}

buildInfra();
