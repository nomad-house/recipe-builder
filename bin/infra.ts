import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { getConfig } from "../config";
import { FullStack } from "nomad-cdk";

export async function buildInfra() {
  const { client, project, stage, env, rootDomain, profile } = await getConfig();
  const prefix = `${client}-${project}-${stage}`;
  const devPort = 4200;
  const logoutCallbackPath = "/";
  const loginCallbackPath = "/authorize";

  const app = new App();

  await FullStack.create(app, "FullStack", {
    env,
    stackName: `${project}-${stage}`,
    stage,
    prefix,
    profile,
    devPort,
    rootDomain,
    auth: {
      logoutCallbackPath,
      loginCallbackPath
    },
    frontend: {
      codePaths: [resolve(__dirname, "..", "dist", "frontend")]
    },
    backend: {
      stage,
      tables: [
        {
          tableName: "demo-table",
          partitionKey: {
            id: "string"
          }
        }
      ],
      code: resolve(__dirname, "..", "dist", "backend", "src"),
      layers: [resolve(__dirname, "..", "dist", "layer")],
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
        },
        {
          functionName: "netlify-auth-callback",
          code: resolve(__dirname, "..", "dist", "backend", "src", "netlify"),
          handler: "index.authCallback",
          events: [
            {
              method: "GET",
              path: "/netlify/callback"
            }
          ]
        },
        {
          functionName: "netlify-auth-success",
          code: resolve(__dirname, "..", "dist", "backend", "src", "netlify"),
          handler: "index.authSuccess",
          events: [
            {
              method: "GET",
              path: "/netlify/success"
            }
          ]
        },
        {
          functionName: "netlify-auth-uri",
          code: resolve(__dirname, "..", "dist", "backend", "src", "netlify"),
          handler: "index.authUri",
          events: [
            {
              method: "GET",
              path: "/netlify/auth"
            }
          ]
        }
      ]
    }
  });

  app.synth();
}

buildInfra();
