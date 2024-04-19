// // import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import entities from 'src/db/tenant-entities';
// cfd607a0-1628-48ac-ba68-d894952bef3f //
@Injectable() //
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {}

  // private orm: MikroORM;
  private entityManagers: Map<string, EntityManager> = new Map();
  private readonly configService = new ConfigService();

  async getEntityManager(tenantId: string): Promise<EntityManager> {
    let entityManager = this.entityManagers.get(tenantId);
    this.logger.log('connecting &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    if (!entityManager) {
      entityManager = await this.connect(`tenant_${tenantId}`);
      this.entityManagers.set(tenantId, entityManager);
    }

    return entityManager;
  }

  private async connect(dbName: string): Promise<EntityManager> {
    const orm = await MikroORM.init({
      type: 'postgresql',
      dbName: dbName,
      host: this.configService.get('DB_HOST'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      entities: entities,
      debug: this.configService.get('NODE_ENV') == 'development', //
    });

    await orm.schema.updateSchema();

    // await this.orm.getMigrator().up();

    return orm.em;
  }

  // private async disconnect(): Promise<void> {
  //   await this.orm.close();
  // }

  // getOrm(): MikroORM {
  //   return this.orm;
  // }
}
