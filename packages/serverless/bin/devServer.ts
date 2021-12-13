import { App } from "@aws-cdk/core";
import { exec } from "@codeified/utils";
import { startDevServer } from "full-stack-pattern";
import { loadLambdas } from "../src";

const app = new App();

(async function main() {
  await exec("npm run build");

  loadLambdas(app);

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
