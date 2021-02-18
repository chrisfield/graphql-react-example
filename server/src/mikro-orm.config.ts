import 'dotenv-defaults/config';
import { MikroORM } from '@mikro-orm/core/MikroORM';
import path from 'path';
import { User, Post } from './entities';
import { Env } from './types';

type EnvValues = Pick<Env, 'dbName' | 'dbUser' | 'dbPassword' | 'dbType' | 'NODE_ENV'>;

const { dbName, dbUser: user, dbPassword: password, dbType, NODE_ENV } = process.env as EnvValues;
export const isProd = NODE_ENV === 'production';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [User, Post],
  dbName,
  user,
  password,
  type: dbType,
  debug: !isProd
} as Parameters<typeof MikroORM.init>[0]
