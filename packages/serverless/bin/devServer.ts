import { resolve } from "path";
import { startDevServer } from "@codeified/infrastructure";

(function main() {
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
