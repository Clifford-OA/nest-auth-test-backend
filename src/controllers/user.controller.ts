import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserInput } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';

@Controller('/user')
@ApiTags('User ')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'update user endpoint' })
  updateUser(
    @Body() input: CreateUserInput,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    if (!tenantId) throw new BadRequestException('Header missing');
    return this.userService.createUser(input);
  }

  @Get()
  @ApiOperation({ summary: 'Get user endpoint' })
  getUsers(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('Header missing');
    return this.userService.getUsers();
  }
}
