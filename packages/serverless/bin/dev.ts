import { App } from "@aws-cdk/core";
import { ServerlessStack, startDevServer } from "full-stack-pattern";
import { exec } from "@recipe-builder/utils";
import { startLocalDynamo } from "./localDynamo";

const app = new App();

(async function main() {
  const dynamoPort = startLocalDynamo();
  await exec("npm run build:ts -- --watch").catch(process.exit);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { lambdas, SERVERLESS_SRC_DIR } = require("../dist/src");

  new ServerlessStack(app, "ServerlessStack", {
    prefix: "serverless-api",
    lambdas,
    code: SERVERLESS_SRC_DIR,
    environment: {
      DYNAMODB_HOST: `http://localhost:${dynamoPort}`
    }
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
