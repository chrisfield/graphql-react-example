import { Resolver, Query } from 'type-graphql';

@Resolver()
class HelloResolver {
  @Query(() => String)
  hello() {
    return 'Hello World';
  }
}

export default HelloResolver;
