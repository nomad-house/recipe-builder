import { resolve } from "path";
import { HandlerConfig, addToDevServer, startDevServer } from "convert-lambda-to-express";
import { exec } from "@codeified/utils";

const handlers: HandlerConfig[] = [
  {
    handler: "handlers/getDocument.handler",
    method: "GET",
    resourcePath: "/documents/{documentId}"
  }
];

(function main() {
  for (const handler of handlers) {
    addToDevServer(handler);
  }

  exec("npm run build:watch");

  startDevServer({
    port: 3001,
    codeDirectory: resolve(__dirname, "..", "dist", "src"),
    corsOptions: {
      origin: "*",
      methods: "*",
      allowedHeaders: "*"
    },
    verbose: true
  });
})();
