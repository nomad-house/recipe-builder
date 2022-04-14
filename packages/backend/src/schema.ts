import { buildSchema } from "type-graphql";
import { resolvers } from "@recipe-builder/models/dist/resolvers";

export function getSchema() {
  return buildSchema({ resolvers });
}
