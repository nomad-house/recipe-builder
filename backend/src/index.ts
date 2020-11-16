import "reflect-metadata";
import { ApolloServer as LambdaApollo } from "apollo-server-lambda";
import { ApolloServer } from "apollo-server";
import { buildSchemaSync } from "type-graphql";
import { StreamResolver } from "./StreamResolver";

const schema = buildSchemaSync({ resolvers: [StreamResolver] });

export const lambda = new LambdaApollo({ schema }).createHandler({});

if (require.main === module) {
  const server = new ApolloServer({ schema });
  server.listen().then(({ url }) => console.log(url));
}
