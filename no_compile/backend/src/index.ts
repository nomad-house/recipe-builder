import "reflect-metadata";
import { ApolloServer as LambdaApollo } from "apollo-server-lambda";
import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { Context, APIGatewayProxyWithCognitoAuthorizerEvent } from "aws-lambda";

interface GraphqlContext {}

// export const lambda = new LambdaApollo({
//   schema,
//   context: async ({
//     event,
//     context
//   }: {
//     event: APIGatewayProxyWithCognitoAuthorizerEvent;
//     context: Context;
//   }): Promise<GraphqlContext> => ({})
// }).createHandler({});

if (require.main === module) {
  const server = new ApolloServer({
    schema,
    context: async ({ req }): Promise<GraphqlContext> => ({})
  });
  server.listen().then(({ url }) => console.log(url));
}
