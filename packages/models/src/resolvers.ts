import "reflect-metadata";
import { NonEmptyArray } from "type-graphql";
import { RecipeResolver } from "./Recipe/RecipeResolver";

export const resolvers: NonEmptyArray<Function> = [RecipeResolver];
