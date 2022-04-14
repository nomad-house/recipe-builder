import { IsString } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { EntityManager, getEntityManager } from "@typedorm/core";
import { Entity, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY } from "@typedorm/common";
import { Repository } from "./Repository";

interface Ingredient {}
interface Step {}
class RecipeVersion {
  ingredients!: Ingredient[];
  steps!: Step[];
}

@ObjectType()
@Entity({
  name: "recipes",
  primaryKey: {
    partitionKey: "#{{id}}",
    sortKey: "#{{id}}"
  }
})
export class Recipe {
  @IsString()
  @Field(() => ID)
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE
  })
  id!: string;

  @Field(() => RecipeVersion)
  versions!: RecipeVersion[];

  get ingredients() {
    return this.versions[0].ingredients;
  }

  get steps() {
    return this.versions[0].steps;
  }
}
