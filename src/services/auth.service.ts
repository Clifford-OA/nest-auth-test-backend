import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput, LoginInput, RefreshInput } from 'src/dtos/user.dto';
import bcrypt from 'bcryptjs';
import { ApiTokensDto } from 'src/dtos/api-token.dto';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly clientIds: string[];
  private readonly jwtRefreshSecret: string;
  private readonly authClient = new OAuth2Client();

  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtRefreshSecret = configService.get('JWT_REFRESH_SECRET');
    this.clientIds = [configService.get('GOOGLE_CLIENT_ID')];
  }

  async registerUser(input: CreateUserInput) {
    // check whether email exist
    let user = await this.em.findOne(User, { email: input.email });

    if (user) throw new BadRequestException('Email already exist');

    user = this.em.create(User, {
      ...input,
      passwordHash: await this.hashPassword(input.password),
    });

    await this.em.flush();
    return 'successfully created user';
  }

  async loginUser(input: LoginInput) {
    input;
    // const filter: FilterQuery<User> = { email: input.email };

    // const user = await this.userRepo.findOne(filter);

    // if (user) {
    //   const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    //   if (isMatch) {
    //     this.logger.log(`User logged in: ${input.email}`);
    //     return await this.generateTokens(user);
    //   }
    // }
    throw new BadRequestException('Invalid credentials');
  }

  async googleOAuth(user: any) {
    if (!user) throw new Error('User not Found');

    // business logic here to return token
    this.logger.log(user, ' business logic here......');
    return this.generateTokens('', '');
  }

  async googleOauthWithToken(token: string) {
    const ticket = await this.authClient.verifyIdToken({
      idToken: token,
      audience: this.clientIds,
    });

    const payload = ticket.getPayload();

    if (!payload) throw new BadRequestException('Invalid ID token');

    console.log({ payload });
  }

  async refresh(input: RefreshInput): Promise<ApiTokensDto> {
    input;
    try {
      // const payload = await this.jwtService.verifyAsync(input.refreshToken, {
      //   secret: this.jwtRefreshSecret,
      // });
      // const user = await this.userRepo.findOneOrFail({ id: payload.sub });
      return await this.generateTokens('user', '');
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(
    userId: string,
    tenantId: string,
  ): Promise<ApiTokensDto> {
    const payload = { sub: userId, tenantId };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1hr',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: this.jwtRefreshSecret,
    });

    return { accessToken, refreshToken };
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
