import type { APIGatewayProxyWithCognitoAuthorizerHandler, Handler } from "aws-lambda";
import { ApolloServer } from "apollo-server-lambda";
import { getSchema } from "./schema";

let graphQlHandler: Handler<any, any>;

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = (event, context, callback) => {
  function runGraphQlRequest() {
    graphQlHandler(event, context, callback);
  }

  if (!graphQlHandler) {
    getSchema().then((schema) => {
      const server = new ApolloServer({ schema });
      graphQlHandler = server.createHandler();
      runGraphQlRequest();
    });
  } else {
    runGraphQlRequest();
  }
};
