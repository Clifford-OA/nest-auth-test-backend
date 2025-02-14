import { EntityManager } from '@mikro-orm/postgresql';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import { Tenant } from 'src/db/entities/tenant.entity';
import { CreateTenantInput } from 'src/dtos/tenant.dto';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import axios from 'axios';
import Docker from 'dockerode';
import { User } from 'src/db/entities/user.entity';
import { getNodeRedConfig } from 'src/utils/node-red-config';

@Injectable()
export class TenantRegistrationService {
  private readonly logger = new Logger(TenantRegistrationService.name);
  private readonly docker = new Docker();

  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService, // private readonly tenantRequestContext: TenantRequestContext,
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
    tenant;

    // await this.tenantRequestContext.tenantQueryContext({
    //   tenantId: tenant.id,
    //   next: async () => {
    //     this.em.create(User, {
    //       email: tenant.adminEmail,
    //       firstName: tenant.adminFirstName,
    //       lastName: tenant.adminLastName,
    //       passwordHash: tenant.passwordHash,
    //       role: Role.Admin,
    //     });

    //     await this.tenantRequestContext.mainQueryContext({
    //       next: async () => {
    //         const result = await this.em.findOne(Tenant, { id: { $ne: null } });
    //         console.log({ result });
    //       },
    //     });

    //     await this.em.flush();
    //   },
    // });

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

  async spinUpTenantNodeRedInstance(tenantId: string) {
    const containerName = `node-red-${tenantId}`;
    const port = 1880 + Math.floor(Math.random() * 1000);
    const dataPath = path.resolve('tenant-node-red', tenantId);

    try {
      const settingsJsContent = getNodeRedConfig([
        {
          username: 'clifford',
          password:
            '$2y$10$H.BNdobJ4bko2SXt9.zxyua5f.48Z9bCO/PtgHESMrnhwj9uf0A7q',
          permissions: '*',
        },
      ]);

      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true });
        this.logger.log(`created directory for tenant: ${tenantId}`);
      }

      // // Write the settings.js file to the tenant's directory
      const settingsFilePath = path.join(dataPath, 'settings.js');
      fs.writeFileSync(
        settingsFilePath,
        `module.exports = ${JSON.stringify(settingsJsContent, null, 2)}`,
      );

      fs.chmodSync(dataPath, 0o777); //Grant full permission
      this.logger.log(`Permission set for tenant directory: ${tenantId}`);

      // check if container with name already exist
      const existingContainer = await this.docker
        .getContainer(containerName)
        .inspect()
        .catch(() => null);
      if (existingContainer)
        throw new BadRequestException(
          `Container for tenant ${tenantId} already exists.`,
        );

      await new Promise<void>((resolve, reject) => {
        this.docker.pull('nodered/node-red:latest', {}, (err, stream) => {
          if (err) return reject(err);

          this.docker.modem.followProgress(stream, (doneErr, output) => {
            if (doneErr) return reject(doneErr);

            this.logger.log('Image pulled successfully:', output);
            resolve();
          });
        });
      });

      // create a new node-red container
      const container = await this.docker.createContainer({
        Image: 'nodered/node-red:latest',
        name: containerName,
        ExposedPorts: { '1880/tcp': {} },
        HostConfig: {
          PortBindings: {
            '1880/tcp': [{ HostPort: port.toString() }],
          },
          Binds: [`${dataPath}:/data`],
        },
      });

      await container.start();
      // await this.addCredentialsToNodeRed(dataPath);

      return `http://localhost:${port}`;
    } catch (error) {
      this.logger.error(
        `Failed to spin up  tenant ${tenantId} Instance`,
        error,
      );
    }
  }

  async fetchTenantEtlProcess(tenantId: string, nodeRedUrl: string) {
    try {
      const response = await axios.get(`${nodeRedUrl}/flows`);
      this.logger.log(response.data);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async spinUpNodeRed(tenantId: string) {
    const containerName = `node-red-${tenantId}`;
    const port = 1880 + Math.floor(Math.random() * 1000);
    const dataPath = path.resolve('tenant-node-red', tenantId);

    try {
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true });
        this.logger.log(`created directory for tenant: ${tenantId}`);
      }

      // check if container with name already exist
      const existingContainer = await this.docker
        .getContainer(containerName)
        .inspect()
        .catch(() => null);
      if (existingContainer)
        throw new BadRequestException(
          `Container for tenant ${tenantId} already exists.`,
        );

      // create a new node-red container
      const container = await this.docker.createContainer({
        Image: 'node-red-test-image',
        name: containerName,
        ExposedPorts: { '1880/tcp': {} }, //
        HostConfig: {
          PortBindings: {
            '1880/tcp': [{ HostPort: port.toString() }],
          },
          Binds: [`${dataPath}:/data`],
        },
      });

      await container.start();

      return `http://localhost:${port}`;
    } catch (error) {
      this.logger.error(
        `Failed to spin up  tenant ${tenantId} Instance`,
        error,
      );
    }
  }

  async getAllImages() {
    const image = this.docker.getImage('node-red-test-image');
    return image;
  }
}
