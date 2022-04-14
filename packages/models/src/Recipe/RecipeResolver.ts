import { Query, Resolver } from "type-graphql";
import { Recipe } from "./Recipe";

@Resolver(Recipe)
export class RecipeResolver {
  @Query(() => [Recipe])
  async listRecipes() {
    return [
      {
        id: "1",
        versions: []
      }
    ];
  }
}
