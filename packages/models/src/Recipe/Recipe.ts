import { IsString } from "class-validator";
import { Field, ID, ObjectType, Resolver } from "type-graphql";
// import { EntityManager, getEntityManager } from "@typedorm/core";
// import { Entity, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY } from "@typedorm/common";
// import { Repository } from "../Repository";

@ObjectType()
class Ingredient {
  @Field()
  id!: string;
}

@ObjectType()
class Step {
  @Field()
  id!: string;
}

@ObjectType()
class RecipeVersion {
  @Field(() => [Ingredient])
  ingredients!: Ingredient[];

  @Field(() => [Step])
  steps!: Step[];
}

@ObjectType()
// @Entity({
//   name: "recipes",
//   primaryKey: {
//     partitionKey: "#{{id}}",
//     sortKey: "#{{id}}"
//   }
// })
export class Recipe {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE
  })
  @IsString()
  @Field()
  id!: string;

  @Field(() => RecipeVersion)
  versions!: RecipeVersion[];

  // get ingredients() {
  //   return this.versions[0].ingredients;
  // }

  // get steps() {
  //   return this.versions[0].steps;
  // }
}
