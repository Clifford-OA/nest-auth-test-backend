import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseService } from 'src/services/database.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly databaseService: DatabaseService) {}

  async use(req: Request | any, res: Response, next: () => void) {
    const tenantId = req.headers['tenantid'] as string; // Implement this function to extract tenant ID
    req.tenantId = tenantId;
    req.em = await this.databaseService.getEntityManager(tenantId);
    next();
  }
}
