import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { User } from './db/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './misc/jwt.strategy';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

import defaultDBConfig from './db/default.config';
import secondConfig from './db/second.config';
import { ReplicationService } from './services/replication.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),

    MikroOrmModule.forRoot(defaultDBConfig),
    MikroOrmModule.forFeature({ entities: [User] }, 'Database_1'),

    MikroOrmModule.forRoot(secondConfig),

    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy,
    AuthService,
    UserService,
    ReplicationService,
  ],
})
export class AppModule {}
