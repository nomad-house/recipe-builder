import { buildSchemaSync } from "type-graphql";
import { StreamResolver } from "./StreamResolver";

export const schema = buildSchemaSync({ resolvers: [StreamResolver] });
