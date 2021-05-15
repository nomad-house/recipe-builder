import { buildInfra } from "./infra";

async function devServer(port: number) {
  const fullStack = await buildInfra(false);
  const server = fullStack?.backend.lambdas.getDevServer();
  if (!server) {
    throw new Error("error building server");
  }
  server.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
  return server;
}

if (require.main === module) {
  const port = process.env.PORT ? +process.env.PORT : 3001;
  devServer(port);
}
