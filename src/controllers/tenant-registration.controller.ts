import { Body, Controller, Post, Headers, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
