import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity()
class Post {
  @Field(() => Int)
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ type: 'string' })
  title!: string;
}

export default Post;
