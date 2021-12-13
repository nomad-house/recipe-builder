import { resolve } from "path";
import { App, RemovalPolicy } from "@aws-cdk/core";

import { FullNestedStack } from "full-stack-pattern";
import { getConfig } from "@codeified/config";

const app = new App();

export async function buildCdk() {
  const config = await getConfig();
  console.log({ config });
  const { env, stage, prefix, profile, subDomain, rootDomain } = config;

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
      includeStarSubdomain: true
    },
    cognito: {
      loginCallbackPath: "/authorize",
      logoutCallbackPath: "/"
    },
    cdn: {
<<<<<<< HEAD
      codePaths: [resolve(__dirname, "..", "..", "frontend", "build")],
=======
      codePaths: [resolve(__dirname, "..", "docs", "build")],
>>>>>>> c8bce20e0e3aab829f43e9c83bfd1eabd64777fe
      buildWwwSubdomain: false,
      codeDeploymentProps: {
        prune: false
      }
    },
    serverless: {}
  });
}

if (require.main === module) {
  console.log("called directly");
  buildCdk().then(() => app.synth());
}
