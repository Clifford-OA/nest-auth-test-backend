import { FilterQuery } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { User, UserRepository } from 'src/db/entities/user.entity';
import { ApiTokensDto } from 'src/dtos/api-token.dto';
import { CreateUserInput, LoginInput, RefreshInput } from 'src/dtos/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtRefreshSecret: string;
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    configService: ConfigService,
  ) {
    this.jwtRefreshSecret = configService.get('JWT_REFRESH_SECRET');
  }

  async registerUser(input: CreateUserInput) {
    // check whether email exist//
    let user = await this.userRepo.findOne({ email: input.email });
    //
    if (user) throw new BadRequestException('Email already exist');
    this.logger.log(`Started registering a user: ${input.email}`);

    user = this.userRepo.create({
      ...input,
      passwordHash: await this.hashPassword(input.password),
    });

    await this.em.flush();
  }

  async loginUser(input: LoginInput) {
    const filter: FilterQuery<User> = { email: input.email };

    const user = await this.userRepo.findOne(filter);

    if (user) {
      const isMatch = await bcrypt.compare(input.password, user.passwordHash);
      if (isMatch) {
        this.logger.log(`User logged in: ${input.email}`);
        return await this.generateTokens(user);
      }
    }
    throw new BadRequestException('Invalid credentials');
  }

  async refresh(input: RefreshInput): Promise<ApiTokensDto> {
    try {
      const payload = await this.jwtService.verifyAsync(input.refreshToken, {
        secret: this.jwtRefreshSecret,
      });
      const user = await this.userRepo.findOneOrFail({ id: payload.sub });
      return await this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User): Promise<ApiTokensDto> {
    const payload = { sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1hr',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: this.jwtRefreshSecret,
    });

    return { accessToken, refreshToken };
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}

// whs_100001
// whs_100002

// whs_200002
//
