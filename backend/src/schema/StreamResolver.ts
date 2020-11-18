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
  @Query(() => [Stream])
  async streamList(): Promise<Stream[]> {
    return [
      { coverImage: "a", id: "a", title: "a", url: "a" },
      { coverImage: "b", id: "b", title: "b", url: "b" },
      { coverImage: "c", id: "c", title: "c", url: "c" },
      { coverImage: "d", id: "d", title: "d", url: "d" },
      { coverImage: "e", id: "e", title: "e", url: "e" }
    ];
  }
}
