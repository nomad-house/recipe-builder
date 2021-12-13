import { resolve } from "path";
import { App, RemovalPolicy } from "@aws-cdk/core";
import { FullNestedStack } from "full-stack-pattern";

import { getConfig } from "@codeified/config";
import { SERVERLESS_SRC_DIR, LAYER_SRC_DIR } from "@codeified/serverless";

const app = new App();

export async function buildCdk() {
  const config = await getConfig();
  console.log({ config });
  const { env, stage, prefix, profile, subDomain, rootDomain, core, cdn, cognito, serverless } =
    config;

  return FullNestedStack.create(app, "Codeified", {
    env,
    stage,
    prefix,
    profile,
    subDomain,
    rootDomain,
    stackName: prefix,
    removalPolicy: RemovalPolicy.DESTROY,
    core: {
      ...core,
      includeStarSubdomain: true
    },
    cognito: {
      ...cognito,
      loginCallbackPath: "/authorize",
      logoutCallbackPath: "/"
    },
    cdn: {
      ...cdn,
      codePaths: [resolve(__dirname, "..", "..", "frontend", "build"), ...(cdn?.codePaths ?? [])]
    },
    serverless: {
      ...serverless,
      tables: [
        {
          name: "demo-table",
          partitionKey: {
            id: "string"
          }
        }
      ],
      code: SERVERLESS_SRC_DIR,
      layers: [LAYER_SRC_DIR]
      // lambdas: [
      //   {
      //     name: "graphql",
      //     handler: "graphql/handler.handler",
      //     events: [
      //       {
      //         method: "GET",
      //         path: "/graphql"
      //       },
      //       {
      //         method: "POST",
      //         path: "/graphql"
      //       }
      //     ]
      //   },
      //   {
      //     name: "netlify-auth-uri",
      //     handler: "netlify/index.authUri",
      //     events: [
      //       {
      //         method: "GET",
      //         path: "/netlify/auth"
      //       }
      //     ],
      //     environment: {
      //       JWT_SECRET: "",
      //       GITHUB_CLIENT_ID: ""
      //     }
      //   },
      //   {
      //     name: "netlify-auth-callback",
      //     handler: "netlify/index.authCallback",
      //     events: [
      //       {
      //         method: "GET",
      //         path: "/netlify/callback"
      //       }
      //     ],
      //     environment: {
      //       JWT_SECRET: "",
      //       ORIGIN: "",
      //       GITHUB_CLIENT_ID: "",
      //       GITHUB_CLIENT_SECRET: ""
      //     }
      //   },
      //   {
      //     name: "netlify-auth-success",
      //     handler: "netlify/index.authSuccess",
      //     events: [
      //       {
      //         method: "GET",
      //         path: "/netlify/success"
      //       }
      //     ]
      //   }
      // ]
    }
  });
}

if (require.main === module) {
  console.log("called directly");
  buildCdk().then(() => app.synth());
}
