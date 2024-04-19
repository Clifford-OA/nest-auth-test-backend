import { EntityManager } from '@mikro-orm/postgresql';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from 'src/db/entities/tenant.entity';
import { AuthService } from './auth.service';
import { CreateTenantInput } from 'src/dtos/tenant.dto';
import { DatabaseService } from './database.service';
import { Role, User } from 'src/db/tenant-entities/user.entity';
import { TenantRequestContext } from 'src/misc/tenant-request-context';
// import HttpContext from 'src/misc/http-context.middleware';

@Injectable()
export class TenantRegistrationService {
  private readonly logger = new Logger(TenantRegistrationService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly tenantRequestContext: TenantRequestContext,
  ) {}

  async registerTenant(input: CreateTenantInput) {
    // check whether email exist
    let tenant = await this.em.findOne(Tenant, {
      churchEmail: input.churchEmail,
    });

    if (tenant) throw new BadRequestException('Tenant already exist');
    this.logger.log(`Started registering a tenant: ${input.churchEmail}`);

    tenant = this.em.create(Tenant, {
      churchEmail: input.churchEmail,
      adminEmail: input.adminEmail,
      churchName: input.churchName,
      phoneNumber: input.phoneNumber,
      adminFirstName: input.adminFirstName,
      adminLastName: input.adminLastName,
      passwordHash: await this.authService.hashPassword(input.adminPassword),
    });

    await this.em.flush();
    return tenant.id;
  }

  async adminApproveTenant(id: string) {
    // const entityManager = HttpContext.get().req?.em;

    const tenant = await this.em.findOneOrFail(Tenant, id, {
      failHandler: () => new NotFoundException(`This tenant was not found`),
    });

    await this.tenantRequestContext.tenantQueryContext({
      tenantId: tenant.id,
      next: async () => {
        this.em.create(User, {
          email: tenant.adminEmail,
          firstName: tenant.adminFirstName,
          lastName: tenant.adminLastName,
          passwordHash: tenant.passwordHash,
          role: Role.Admin,
        });

        await this.tenantRequestContext.mainQueryContext({
          next: async () => {
            const result = await this.em.findOne(Tenant, { id: { $ne: null } });
            console.log({ result });
          },
        });

        await this.em.flush();
      },
    });

    return { success: true };
  }

  async adminGetTenant(tenantId: string, userId: string) {
    const tenant = await this.em.findOneOrFail(Tenant, tenantId, {
      failHandler: () => new NotFoundException(`This tenant was not found`),
    });
    const entityManager = await this.databaseService.getEntityManager(
      tenant.id,
    );

    const user = await entityManager.findOneOrFail(User, userId, {
      failHandler: () => new NotFoundException(`This tenant was not found`),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, passwordResetKey, ...others } = user;

    return others;
  }
}
