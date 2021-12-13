import { App } from "@aws-cdk/core";
import { ServerlessStack, startDevServer } from "full-stack-pattern";
import { exec } from "@codeified/utils";

const app = new App();

(async function main() {
  await exec("npm run build");
  exec("tsc --watch", false).catch(process.exit);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { lambdas, SERVERLESS_SRC_DIR } = require("../dist/src");

  new ServerlessStack(app, "ServerlessStack", {
    prefix: "serverless-api",
    lambdas,
    code: SERVERLESS_SRC_DIR
  });

  startDevServer({
    verbose: true,
    port: 3001,
    corsOptions: {
      origin: "*",
      methods: "*",
      allowedHeaders: "*"
    }
  });
})();
