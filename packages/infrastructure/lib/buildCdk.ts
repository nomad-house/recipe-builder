import { App, RemovalPolicy } from "@aws-cdk/core";
import { FullNestedStack } from "full-stack-pattern";

import { getConfig } from "@codeified/config";
import { SERVERLESS_SRC_DIR, LAYER_SRC_DIR, lambdas } from "@codeified/serverless";
import { FRONTEND_SRC_DIR } from "@codeified/frontend";

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
      codePaths: [FRONTEND_SRC_DIR]
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
      layers: [LAYER_SRC_DIR],
      lambdas
    }
  });
}

if (require.main === module) {
  console.log("called directly");
  buildCdk().then(() => app.synth());
}
