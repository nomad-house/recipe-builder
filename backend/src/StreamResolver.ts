import { Arg, Field, ID, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class Stream {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  coverImage: string;

  @Field()
  url: string;
}

@Resolver(Stream)
export class StreamResolver {
  @Query(returns => [Stream])
  async streamList() {
    return [
      { coverImage: "", id: "", title: "", url: "" },
      { coverImage: "", id: "", title: "", url: "" },
      { coverImage: "", id: "", title: "", url: "" },
      { coverImage: "", id: "", title: "", url: "" },
      { coverImage: "", id: "", title: "", url: "" }
    ] as Stream[];
  }
}
