/* eslint-disable @typescript-eslint/no-unused-vars */
import { TenantRegistrationController } from './controllers/tenant-registration.controller';
import { TenantRegistrationService } from './services/tenant-registration.service';
import { DatabaseService } from './services/database.service';
import { WebhooksController } from './controllers/webhooks.controller';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { AzureBlobController } from './controllers/azure-blob.controller';
import { AzureBlobService } from './services/azure-blob.service';
import { EmailService } from './email/email.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import entities from './db/entities';
import { AuthService } from './services/auth.service';
// import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { JwtStrategy } from './misc/jwt.strategy';
import { GoogleOauthStrategy } from './misc/google-oauth.strategy';
import { RequestContextModule } from 'nestjs-request-context';
import { TenantMiddleware } from './misc/tenant.middleware';
import { TenantRequestContext } from './misc/tenant-request-context';
import { SocketModule } from './socket/socket.module';
import mikroOrmConfig from './mikro-orm.config';
import { ClerkClientProvider } from './services/clerk-client.service';
import { ClerkStrategy } from './misc/clerk.strategy';
import { PassportModule } from '@nestjs/passport';
import { ClerkService } from './services/clerk-auth.service';
import { ClerkController } from './controllers/clerk.controller';
import { ClerkWebhookController } from './controllers/clerk-webhook.controller';
import { ClerkWebhookService } from './services/clerk-webhook.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature(entities),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    RequestContextModule,
    SocketModule,
    PassportModule,
  ],
  controllers: [
    // TenantRegistrationController,
    // WebhooksController,
    // PaymentController,
    // AzureBlobController,
    // AuthController,
    // UserController,
    ClerkController,
    ClerkWebhookController,
  ],
  providers: [
    // TenantRegistrationService,
    // TenantRequestContext,
    // DatabaseService,
    // PaymentService,

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // AzureBlobService,
    // JwtStrategy,
    // AuthService,
    // UserService,
    // EmailService,
    // GoogleOauthStrategy,
    ClerkClientProvider,
    ClerkStrategy,
    ClerkService,
    ClerkWebhookService,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   // consumer.apply(TenantMiddleware).forRoutes('*');
  // }
}
