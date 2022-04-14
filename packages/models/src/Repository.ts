import { getEntityManager } from "@typedorm/core";

type StringId = { id: string };
export class Repository<T extends StringId> {
  private entityManager = getEntityManager();

  constructor(private ctr: new (...args: any[]) => T) {
    this.entityManager.find;
    this.entityManager.update;
  }

  public exists(idOrInstance: string | Partial<T>) {
    const partial =
      idOrInstance instanceof this.ctr ? idOrInstance : ({ id: idOrInstance } as Partial<T>);
    return this.entityManager.exists<T>(this.ctr, partial);
  }

  public create(propsOrInstance: T | { [K in keyof T]: T[K] }) {
    const _instance = propsOrInstance instanceof this.ctr ? propsOrInstance : new this.ctr();

    for (const [key, value] of Object.entries(_instance)) {
      _instance[key as keyof T] = value as unknown as T[keyof T];
    }

    return this.entityManager.create<T>(_instance);
  }

  public delete(idOrInstance: string | T) {
    return this.entityManager.delete(this.ctr, {
      id: typeof idOrInstance === "string" ? idOrInstance : idOrInstance.id
    });
  }

  public findById(id: string) {
    return this.entityManager.findOne(this.ctr, { id });
  }

  public findOne(props: Partial<T> & StringId) {
    return this.entityManager.update<T>(this.ctr, { id: props.id } as Partial<T>, props);
  }

  public count(search?: { [K in keyof T]: T[K] }) {
    // TODO: this seems wrong
    return this.entityManager.count(this.ctr, search);
  }
}
