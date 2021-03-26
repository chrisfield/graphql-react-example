/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Ctx, Arg } from 'type-graphql';
import argon2 from 'argon2';
import { MyContext } from '../../types';
import { User } from '../../entities';
import UserResponse from './user-response';
import UsernamePasswordInput from './username-password-input';

@Resolver()
class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    const { userId } = req.session;
    if (userId === undefined) {
      return null;
    }
    const user = await em.findOne(User, { id: userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('inputs', () => UsernamePasswordInput) inputs: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = inputs;
    if (username.length <= 2) {
      return { errors: [{ field: 'username', message: 'Length must be greater that 2' }] };
    }
    if (password.length <= 2) {
      return { errors: [{ field: 'password', message: 'Length must be greater that 2' }] };
    }
    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505') {
        // duplicate key
        return { errors: [{ field: 'username', message: 'Username is already taken' }] };
      }
      throw err;
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('inputs', () => UsernamePasswordInput) inputs: UsernamePasswordInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = inputs;
    const user = await em.findOne(User, { username });
    if (!user) {
      return { errors: [{ field: 'username', message: 'That username does not exist' }] };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return { errors: [{ field: 'password', message: 'Invalid password' }] };
    }
    req.session.userId = user.id;
    return { user };
  }
}

export default UserResolver;
