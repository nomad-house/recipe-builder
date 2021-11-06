import { watch } from "fs";
import { createServer } from "http";
import { spawn } from "child_process";
import { resolve } from "path";
import { buildInfra } from "./infra";

async function devServer(port: number) {
  const fullStack = await buildInfra(false);

  const backend = resolve(__dirname, "..", "backend");

  const ts = spawn("npm", ["run", "dev"], { cwd: backend, stdio: "inherit" });
  ts.on("error", err => console.log(err));
  process.on("exit", () => ts.kill());

  function getServer() {
    const app = fullStack?.backend.lambdas.getDevServer();
    if (!app) {
      throw new Error("error building server");
    }
    const server = createServer(app);
    server.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
    return server;
  }

  let server = getServer();

  watch(resolve(backend, "dist"), { recursive: true }, () => {
    server.close(() => {
      server = getServer();
    });
  });
}

if (require.main === module) {
  const port = process.env.PORT ? +process.env.PORT : 3001;
  devServer(port);
}
