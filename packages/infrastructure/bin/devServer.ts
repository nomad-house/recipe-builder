import { buildCdk } from "../lib/buildCdk";
import { startDevServer } from "full-stack-pattern";

(async function devServer() {
  await buildCdk();
  startDevServer({
    port: 3001,
    verbose: true
  });
})();
