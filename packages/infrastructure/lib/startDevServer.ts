import { startDevServer as START_DEV_SERVER, DevServerConfig } from "full-stack-pattern";
import { buildCdk } from "./buildCdk";

export async function startDevServer(config: DevServerConfig) {
  await buildCdk();
  return START_DEV_SERVER({
    port: 3001,
    verbose: true,
    ...config
  });
}
