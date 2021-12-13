import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { exec } from "@codeified/utils";
import { Lambdas, startDevServer } from "full-stack-pattern";
import { lambdas } from "../src";

const app = new App();

(async function main() {
  await exec("npm run build");

  const construct = new Lambdas(app, "Lambdas", {
    lambdas,
    code: resolve(__dirname, "..", "dist", "src")
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
