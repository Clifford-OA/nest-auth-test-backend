import { ConfigService } from '@nestjs/config';

import entities from './db/entities';
// import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import dotenv from 'dotenv';
dotenv.config();

const configService = new ConfigService();

import { ReflectMetadataProvider } from '@mikro-orm/core';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/postgresql';

export function createMikroOrmConfig(dbName: string): MikroOrmModuleOptions {
  return defineConfig({
    dbName: dbName,
    host: configService.get('DB_HOST'),
    user: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    entities: entities,
    metadataProvider: ReflectMetadataProvider,
    debug: configService.get('NODE_ENV') === 'development',
    migrations: {
      pathTs: './src/db/migrations',
      path: './dist/db/migrations',
      disableForeignKeys: false,
    },
  });
}

// export default {
//   type: 'postgresql',
//   dbName: configService.get('DB_NAME'),
//   host: configService.get('DB_HOST'),
//   user: configService.get('DB_USER'),
//   password: configService.get('DB_PASSWORD'),
//   entities: entities,
//   metadataProvider: TsMorphMetadataProvider,
//   debug: configService.get('NODE_ENV') == 'development',
//   // migrations: {
//   //   pathTs: './src/db/migrations',
//   //   path: './dist/db/migrations',
//   //   disableForeignKeys: false,
//   // },
// } as MikroOrmModuleSyncOptions;
