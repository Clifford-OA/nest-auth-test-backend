/* eslint-disable @typescript-eslint/no-unused-vars */
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RequestContextModule } from 'nestjs-request-context';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import entities from './db/entities';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './misc/jwt.strategy';
import { AuthService } from './services/auth.service';
import { DynamicDatabaseService } from './services/dynamic-database.service';
import { UserService } from './services/user.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MikroOrmModule.forRoot({
      entities,
      dbName: 'public',
      driver: PostgreSqlDriver,
    }),
    MikroOrmModule.forFeature(entities),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    RequestContextModule,
    // SocketModule,
    PassportModule,
  ],
  controllers: [
    // TenantRegistrationController,
    // WebhooksController,
    // PaymentController,
    // AzureBlobController,
    AuthController,
    UserController,
    // ClerkController,
    // ClerkWebhookController,
  ],
  providers: [
    // TenantRegistrationService,
    // TenantRequestContext,
    // DatabaseService,
    // PaymentService,
    DynamicDatabaseService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // AzureBlobService,
    JwtStrategy,
    AuthService,
    UserService,
    // EmailService,
    // GoogleOauthStrategy,
    // ClerkClientProvider,
    // ClerkStrategy,
    // ClerkService,
    // ClerkWebhookService,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   // consumer.apply(TenantMiddleware).forRoutes('*');
  // }
}
