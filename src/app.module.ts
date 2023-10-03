import { AzureBlobController } from './controllers/azure-blob.controller';
import { AzureBlobService } from './services/azure-blob.service';
import { EmailService } from './email/email.service';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import entities from './db/entities';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './misc/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature(entities),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AzureBlobController, AuthController, UserController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    AzureBlobService,
    JwtStrategy,
    AuthService,
    UserService,
    EmailService,
  ],
})
export class AppModule {}
