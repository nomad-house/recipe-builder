import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { ServerlessStack } from "../lib/cdk/stacks/ServerlessStack";
import { getConfig } from "../config";
import { AssetCode, Runtime } from "@aws-cdk/aws-lambda";
// import { getHostedZoneId } from "../lib/aws/route53";
// import { getApiGatewayAccountRole } from "../lib/aws/apiGateway";
// import { CoreStack } from "../lib/cdk/CoreStack";
// import { StaticAssetsStack } from "../lib/cdk/StaticAssetsStack";
// import { AuthStack } from "../lib/cdk/Cognito";
// import { BackendStack } from "lib/cdk/BaseStack";

// interface SynthParams {
//   project: string;
//   stage: string;
//   region: string;
//   account: string;
//   rootDomain: string;
// }

export async function buildInfra() {
  const config = await getConfig();
  const prefix = `${config.client}-${config.project}-${config.stage}`;

  const app = new App();

  new ServerlessStack(app, "Backend", {
    prefix,
    code: new AssetCode(resolve(__dirname, "..", "dist", "backend")),
    runtime: Runtime.NODEJS_14_X,
    tables: [
      {
        tableName: "demo-table",
        partitionKey: {
          id: "string"
        }
      }
    ],
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
  // const cloudWatchRoleArn = await getApiGatewayAccountRole();
  // const hostedZoneId = await getHostedZoneId({ rootDomain });
  // const coreStack = new CoreStack(app, "CoreStack", {
  //   stackName: `${project}-core`,
  //   env,
  //   rootDomain,
  //   hostedZoneId,
  //   cloudWatchRoleArn
  // });

  // const groups = ["admin"] as const;
  // const auth = new AuthStack<typeof groups>(app, "AuthStack", {
  //   prefix,
  //   groups
  // });

  // new BackendStack(app, "BackendStack", {
  //   prefix,
  //   userPool: auth.userPool
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
