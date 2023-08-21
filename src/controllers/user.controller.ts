import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserInput } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';

@Controller('/user')
@ApiTags('User ')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiOperation({ summary: 'update user endpoint' })
  updateUser(@Body() input: UpdateUserInput) {
    return this.userService.updateUser(input);
  }
}
