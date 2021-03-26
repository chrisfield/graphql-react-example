import 'dotenv-defaults/config';
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import mikroOrmConfig from './mikro-orm.config';
import { Hello, User, Post } from './resolvers';
import { Env, MyContext } from './types';

type EnvValues = Pick<Env, 'port' | 'sessionSecret' | 'NODE_ENV'>;

const { port, sessionSecret, NODE_ENV } = process.env as EnvValues;

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: sessionSecret,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Hello, User, Post],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.get('/', (_, res) => {
    res.send('hello');
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
  });
};

main();
