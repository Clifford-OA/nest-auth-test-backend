import { ReflectMetadataProvider } from '@mikro-orm/core';
import dotenv from 'dotenv';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import entities from './db/entities';
dotenv.config();

export default {
  type: 'postgresql',
  clientUrl: process.env.MIKRO_ORM_DB_URL,
  entities: entities,
  registerRequestContext: false,
  metadataProvider: ReflectMetadataProvider,
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './src/db/default/migrations',
    disableForeignKeys: false,
  },
} as MikroOrmModuleSyncOptions;
