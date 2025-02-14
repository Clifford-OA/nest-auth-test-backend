import { EntityManager } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { createMikroOrmConfig } from 'src/mikro-orm.config';
import HttpContext from 'src/misc/http-context.middleware';

@Injectable()
export class DynamicDatabaseService {
  private entityManager: EntityManager;

  constructor() {}

  async getEntityManager() {
    if (!this.entityManager) {
      const dbName = this.getDatabaseNameFromRequest();
      const orm = await MikroORM.init(createMikroOrmConfig(dbName));
      const generator = orm.getSchemaGenerator();
      await generator.updateSchema();
      this.entityManager = orm.em.fork({ disableContextResolution: true });
    }
    //
    return this.entityManager;
  }

  private getDatabaseNameFromRequest(): string {
    const req = HttpContext.get()?.req;
    // Extract schema name from request (e.g., JWT token, headers, or session)
    const tenantId = req.headers['x-tenant-id'];
    return tenantId ? `tenant_${tenantId}` : 'multiple-schema-test';
  }
}
