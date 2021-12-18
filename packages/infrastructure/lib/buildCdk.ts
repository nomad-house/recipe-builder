import { App, RemovalPolicy } from "@aws-cdk/core";
import { FullNestedStack } from "full-stack-pattern";

import { getConfig } from "@codeified/config";
import { serverlessProps } from "@codeified/serverless";
import { FRONTEND_SRC_DIR } from "@codeified/frontend";

const app = new App();

export async function buildCdk() {
  const config = await getConfig();
  console.log({ config });
  const { prefix, core, cdn, cognito, serverless } = config;

  return FullNestedStack.create(app, "Codeified", {
    ...config,
    stackName: prefix,
    removalPolicy: RemovalPolicy.DESTROY,
    core: {
      ...(core ?? {}),
      includeStarSubdomain: true
    },
    cognito: {
      ...(cognito ?? {}),
      loginCallbackPath: "/authorize",
      logoutCallbackPath: "/"
    },
    cdn: {
      ...(cdn ?? {}),
      codePaths: [FRONTEND_SRC_DIR]
    },
    serverless: {
      ...(serverless ?? {}),
      ...serverlessProps
    }
  });
}

if (require.main === module) {
  console.log("called directly");
  buildCdk().then(() => app.synth());
}
