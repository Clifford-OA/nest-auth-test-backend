import { ReflectMetadataProvider } from '@mikro-orm/core';
import entities from './entities';
import dotenv from 'dotenv';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
dotenv.config();

export default {
  type: 'postgresql',
  clientUrl: process.env.MIKRO_ORM_DB_URL,
  entities: entities,
  registerRequestContext: false,
  contextName: 'Database_1',
  metadataProvider: ReflectMetadataProvider,
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './db/default/migrations',
    disableForeignKeys: false,
  },
} as MikroOrmModuleSyncOptions;
