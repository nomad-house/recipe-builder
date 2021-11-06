import { ApolloServer, gql } from "apollo-server-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { Neo4jService } from "../db/getDb";

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => "Hello world!"
//   }
// };

const typeDefs = gql`
  type Topic {
    name: String
    subTopics: [Topic] @relationship(type: "SUB_TOPIC", direction: OUT)
  }

  type Idea {
    name: String
  }
`;

let graphqlHandler: APIGatewayProxyHandler;

async function setup() {
  if (!graphqlHandler) {
    const secrets = await Neo4jService.getSecrets();
    const driver = Neo4jService.getDriver(secrets);
    const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
    const server = new ApolloServer({
      schema: neoSchema.schema,
      introspection: true,
      context: ({ event, context }) => ({
        headers: event.headers,
        functionName: context.functionName,
        event,
        context
      })
    });

    graphqlHandler = server.createHandler();
  }
}

export const handler: APIGatewayProxyHandler = (event, context, callback) => {
  console.log(event);
  setup()
    .then(() => {
      const promiseResult = graphqlHandler(event, context, callback);
      if (promiseResult) {
        promiseResult.then(response => callback(null, response)).catch(err => callback(err));
      }
    })
    .catch(err => callback(err));
};
