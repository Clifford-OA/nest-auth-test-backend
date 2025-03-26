import { ReflectMetadataProvider } from '@mikro-orm/core';
import secondentities from './secondentities';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';

export default {
  type: 'postgresql',
  contextName: 'Database_2',
  clientUrl: process.env.MIKRO_ORM_SECOND_DB_URL,
  entities: secondentities,
  registerRequestContext: false,
  metadataProvider: ReflectMetadataProvider,
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './db/second/migrations',
    disableForeignKeys: false,
  },
} as MikroOrmModuleSyncOptions;
