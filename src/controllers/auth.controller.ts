import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserInput, LoginInput } from 'src/dtos/user.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register user' })
  registerUser(@Body() input: CreateUserInput) {
    return this.authService.registerUser(input);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in with email and password' })
  login(@Body() input: LoginInput) {
    return this.authService.loginUser(input);
  }
}
