import { RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { TenantQueryInput } from 'src/dtos/tenant-query-context.dto';
import { DatabaseService } from 'src/services/database.service';

@Injectable()
export class TenantRequestContext {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly em: EntityManager,
  ) {}

  async tenantQueryContext(input: TenantQueryInput) {
    // connect to tenant database
    const entityManager = await this.databaseService.getEntityManager(
      input.tenantId,
    );

    // make my queries here
    await RequestContext.createAsync(
      entityManager.fork({ disableContextResolution: true }),
      input.next,
    );
  }

  async mainQueryContext(input: Pick<TenantQueryInput, 'next'>) {
    // make my queries here
    await RequestContext.createAsync(
      this.em.fork({ disableContextResolution: true }),
      input.next,
    );
  }
}
