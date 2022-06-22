import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { getSchema } from "./schema";

const PORT = parseInt(process.env.PORT ?? "3001");

async function startServer(port: number) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: await getSchema(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startServer(PORT);
