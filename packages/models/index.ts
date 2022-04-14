import { IsString } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { EntityManager, getEntityManager } from "@typedorm/core";
import { Entity, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY } from "@typedorm/common";

export class Repository<T> {
  private entityManager = getEntityManager();

  constructor(private ctr: new (...args: any[]) => T) {}

  // public static findOne(props: Partial<Recipe>) {
  //   return entityManger.findOne(Recipe, {
  //     id: response.id,
  //     status: "onboarding",
  //     active: true
  //   });
  // }

  public findById(id: string) {
    return this.entityManager.findOne(this.ctr, { id });
  }

  // public static delete(idOrRecipe: string | Recipe) {
  //   return RecipeRepository.entityManager.delete(Recipe, {
  //     id: typeof idOrRecipe === "string" ? idOrRecipe : idOrRecipe.id
  //   });
  // }

  // public static create(recipe: Recipe) {
  //   return RecipeRepository.entityManager.create(recipe);
  // }
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
}

const Recipes = new Repository<Recipe>(Recipe);

Recipes.findById("1");
