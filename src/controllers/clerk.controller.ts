import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProtectedApi } from 'src/decorators/protected-api.decorator';
import { CreateUserInput } from 'src/dtos/user.dto';
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

  @Post('signup')
  async getUnprotectedData(@Body() input: CreateUserInput) {
    return this.clerkService.getUprotectedData(input);
  }

  @Get('/clerk')
  async getClerkData() {
    return this.clerkService.getClerkData();
  }
}
