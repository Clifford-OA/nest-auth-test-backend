import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserInput, LoginInput } from 'src/dtos/user.dto';
import { GoogleOauthGuard } from 'src/guards/google-oauth.guard';
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

  @Get('/login/google')
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {}

  // router to configured redirect url in google console.
  @Get('/callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const token = await this.authService.googleOAuth(req.user);
      res.redirect(
        `http://localhost:3000/oauth?token=${token.accessToken}&refresh=${token.refreshToken}`,
      );
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  }
}
