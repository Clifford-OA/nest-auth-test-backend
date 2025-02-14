import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DynamicDatabaseService } from 'src/services/dynamic-database.service';

@Injectable()
export class DynamicTenantMiddleware implements NestMiddleware {
  constructor(
    private readonly dynamicDatabaseService: DynamicDatabaseService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (tenantId) {
      await this.dynamicDatabaseService.getEntityManager();
    }
    next();
  }
}
