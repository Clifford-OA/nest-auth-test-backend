import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProtectedApi } from 'src/decorators/protected-api.decorator';
import { ClerkService } from 'src/services/clerk-auth.service';

@Controller('/clerks')
@ApiTags('Clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

  @ProtectedApi()
  @Get('me')
  async getProfile() {
    return this.clerkService.getData();
  }

  @Get('unprotected')
  async getUnprotectedData() {
    return this.clerkService.getUprotectedData();
  }
}
