import { Query, Resolver } from "type-graphql";
import { Recipe } from "./Recipe";

@Resolver(Recipe)
export class RecipeResolver {
  @Query(() => [Recipe])
  async ListRecipes(): Promise<Recipe[]> {
    return [
      {
        id: "1",
        versions: [
          {
            ingredients: [{ id: "ingredient1" }, { id: "ingredient2" }],
            steps: [{ id: "step1" }, { id: "step2" }]
          }
        ]
      }
    ];
  }
}
