import { resolve } from "path";
require("dotenv").config({ path: resolve(__dirname, "..", "..", "..", ".env") });
import { ApolloServer, gql } from "apollo-server";
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

const driver = Neo4jService.getDriver({
  user: process.env.NEO4J_USER!,
  password: process.env.NEO4J_PASSWORD!
});
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
const server = new ApolloServer({
  schema: neoSchema.schema,
  introspection: true,
  playground: true,
  context: ({ req }) => ({ req })
});
server.listen().then(({ port }) => {
  console.log("listening on port " + port);
});
