import { Body, Controller, Post, Headers, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
// import { ProtectedApi } from 'src/decorators/protected-api.decorator';
import { CreateTenantInput } from 'src/dtos/tenant.dto';
import { TenantRegistrationService } from 'src/services/tenant-registration.service';

@Controller('/tenants')
@ApiTags('Tenants')
export class TenantRegistrationController {
  constructor(
    private readonly tenantRegistrationService: TenantRegistrationService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register tenant for the application' })
  registerTenants(@Body() input: CreateTenantInput) {
    return this.tenantRegistrationService.registerTenant(input);
  }

  //   @ProtectedApi()
  @Post('/approve')
  @ApiOperation({ summary: 'Approve tenant application request' })
  approveTenant(@Headers('tenantId') tenantId: string) {
    return this.tenantRegistrationService.adminApproveTenant(tenantId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user from tenant ' })
  getUser(@Headers('tenantId') tenantId: string, @Param('id') id: string) {
    return this.tenantRegistrationService.adminGetTenant(tenantId, id);
  }

  @Post('/spinup/nodered')
  @ApiOperation({ summary: 'Spin up tenant node red instance' })
  spinUpTenantNodeRedInstance() {
    const uuid = randomUUID();
    return this.tenantRegistrationService.spinUpTenantNodeRedInstance(uuid);
  }

  @Get('/get-nodered/flow')
  @ApiOperation({ summary: 'Get node red etl flow ' })
  getNodeRedEtl() {
    return this.tenantRegistrationService.fetchTenantEtlProcess(
      '3de21021-44fa-403c-b53f-c71fb1b4ac15',
      'http://localhost:2374',
    );
  }

  @Post('/node-red/new-tenant')
  @ApiOperation({ summary: 'Spin up tenant nodered container' })
  generateTenantContainer() {
    const id = randomUUID();
    return this.tenantRegistrationService.spinUpNodeRed(id);
  }

  @Get('/images/all')
  @ApiOperation({ summary: 'Get all images' })
  getImages() {
    return this.tenantRegistrationService.getAllImages();
  }
}
