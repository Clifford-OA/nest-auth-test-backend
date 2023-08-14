import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ConfigService } from '@nestjs/config';

import entities from './db/entities';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';

const configService = new ConfigService();

export default {
  type: 'postgresql',
  dbName: configService.get('DB_NAME'),
  host: configService.get('DB_HOST'),
  user: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  entities: entities,
  metadataProvider: TsMorphMetadataProvider,
  debug: configService.get('NODE_ENV') == 'development',
  migrations: {
    pathTs: './src/db/migrations',
    path: './dist/db/migrations',
    disableForeignKeys: false,
  },
  // seeder: {
  //   pathTs: './src/db/seeders',
  //   path: './dist/db/seeders',
  //   fileName: (className: string) => {
  //     return className
  //       .substring(0, className.length - 'Seeder'.length) // Remove 'Seeder' suffix
  //       .replace(
  //         // Convert to kebab case
  //         /[A-Z]+(?![a-z])|[A-Z]/g,
  //         ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  //       )
  //       .concat('.seeder'); // Add suffix
  //   },
  // },
} as MikroOrmModuleSyncOptions;
