import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProtectedApi } from 'src/decorators/protected-api.decorator';
import { UpdateUserInput } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';

@Controller('/user')
@ProtectedApi()
@ApiTags('User ')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiOperation({ summary: 'update user endpoint' })
  updateUser(@Body() input: UpdateUserInput) {
    return this.userService.updateUser(input);
  }
}
