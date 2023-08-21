import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/db/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepo: UserRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequests: ExtractJwt.fromAuthHeaderAsBearerToken(),
      scretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (payload.sub) {
      const user = await this.userRepo.findOne(payload.sub);
      if (user) return user;
    }

    return null;
  }
}
