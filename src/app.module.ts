import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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

import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { SecondDatabaseService } from './services/db.service';
import { ReplicationService } from './services/replication.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),

    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({ entities: [User] }),

    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy,
    AuthService,
    UserService,
    SecondDatabaseService,
    ReplicationService,
  ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppModule.name);
  constructor(
    private readonly orm: MikroORM,
    private readonly dbService: SecondDatabaseService,
    private readonly replicationService: ReplicationService,
  ) {}

  private em2: EntityManager;

  async onModuleInit() {
    await this.orm.migrator.up();

    this.em2 = (await this.dbService.waitForInitialization()) as EntityManager;
    await this.replicationService.setupLogicalReplication(this.em2);
  }

  async onModuleDestroy() {
    await this.dbService.close();
  }
}
