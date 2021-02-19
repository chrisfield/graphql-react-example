/* eslint-disable class-methods-use-this */

import { Resolver, Query } from 'type-graphql';

@Resolver()
class HelloResolver {
    @Query(() => String)
    hello(): string {
        return 'Hello World';
    }
}

export default HelloResolver;
