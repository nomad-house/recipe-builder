import { getEntityManager } from "@typedorm/core";

export class Repository<T extends { id: string }> {
  private entityManager = getEntityManager();

  constructor(private ctr: new (...args: any[]) => T) {}

  public create(propsOrInstance: T | { [K in keyof T]: T[K] }) {
    const _instance = propsOrInstance instanceof this.ctr ? propsOrInstance : new this.ctr();

    for (const [key, value] of Object.entries(_instance)) {
      _instance[key as keyof T] = value as unknown as T[keyof T];
    }

    return this.entityManager.create(_instance);
  }

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
}
