import 'dotenv-defaults/config';
import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Posts';
import config from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  // const post = orm.em.create(Post, {title: 'My first post'});
  // await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main();
