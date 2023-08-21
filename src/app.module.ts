import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import entities from './db/entities';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature(entities),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AppModule {}
