import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Request, Response } from 'express';

type SessionData = {
    userId?: number;
};

export type MyContext = {
    req: Request & { session: SessionData };
    res: Response;
    em: EntityManager<IDatabaseDriver<Connection>>;
};

export type Env = {
    NODE_ENV: string;
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbType: string;
    port: string;
    sessionSecret: string;
};
