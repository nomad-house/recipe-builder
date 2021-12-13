import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { getConfig } from "@codeified/config";
import { FullStack, FullStackProps } from "full-stack-pattern";
require("dotenv").config();

export async function buildInfra(synth: boolean) {
  const { client, project, stage, env, rootDomain, profile } = await getConfig();
  const prefix = `${client}-${project}-${stage}`;
  const devPort = 4200;
  const logoutCallbackPath = "/";
  const loginCallbackPath = "/authorize";

  const JWT_SECRET = `${process.env.JWT_SECRET}`;
  const GITHUB_CLIENT_ID = `${process.env.GITHUB_CLIENT_ID}`;
  const GITHUB_CLIENT_SECRET = `${process.env.GITHUB_CLIENT_SECRET}`;
  const ORIGIN = process.env.ORIGIN ?? "http://localhost:3001";

  const app = new App();
  const config: FullStackProps = {
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
      codePaths: [resolve(__dirname, "..", "frontend", "dist")]
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
      code: resolve(__dirname, "..", "backend", "dist", "src"),
      layers: [resolve(__dirname, "..", "backend", "layer")],
      lambdas: [
        {
          functionName: "graphql",
          handler: "graphql/handler.handler",
          events: [
            {
              method: "get",
              path: "/graphql"
            },
            {
              method: "post",
              path: "/graphql"
            }
          ]
        },
        {
          functionName: "netlify-auth-uri",
          handler: "netlify/index.authUri",
          events: [
            {
              method: "get",
              path: "/netlify/auth"
            }
          ],
          environment: {
            JWT_SECRET,
            GITHUB_CLIENT_ID
          }
        },
        {
          functionName: "netlify-auth-callback",
          handler: "netlify/index.authCallback",
          events: [
            {
              method: "get",
              path: "/netlify/callback"
            }
          ],
          environment: {
            JWT_SECRET,
            ORIGIN,
            GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET
          }
        },
        {
          functionName: "netlify-auth-success",
          handler: "netlify/index.authSuccess",
          events: [
            {
              method: "get",
              path: "/netlify/success"
            }
          ]
        }
      ]
    }
  };
  if (!synth) {
    return new FullStack(app, "FullStack", config);
  }

  await FullStack.create(app, "FullStack", config);
  app.synth();
  return;
}

if (require.main === module) {
  buildInfra(true);
}
