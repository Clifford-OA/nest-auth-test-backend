import { ReflectMetadataProvider } from '@mikro-orm/core';
import secondentities from './secondentities';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import dotenv from 'dotenv';
dotenv.config();

export default {
  type: 'postgresql',
  // contextName: 'Database_2',
  clientUrl: process.env.MIKRO_ORM_SECOND_DB_URL,
  entities: secondentities,
  registerRequestContext: false,
  metadataProvider: ReflectMetadataProvider,
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './src/db/second/migrations',
    pathTs: undefined, // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts',
  },
} as MikroOrmModuleSyncOptions;
