import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
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
    // ReplicationService,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  constructor(
    private readonly orm: MikroORM,
    private readonly dbService: SecondDatabaseService,
  ) {}

  private readonly em = this.orm.em.fork() as EntityManager;
  private em2: EntityManager;

  async onModuleInit() {
    await this.orm.migrator.up();

    try {
      this.em2 =
        (await this.dbService.waitForInitialization()) as EntityManager;
      await this.setupLogicalReplication();
    } finally {
      await this.dbService.close();
    }
  }
  //
  private async setupLogicalReplication() {
    try {
      // 1. Ensure publication exists on publisher
      await this.ensurePublicationExists();

      // 2. Ensure subscription exists on subscriber
      await this.ensureSubscriptionExists();

      this.logger.log('Database replication setup completed');
    } catch (error) {
      this.logger.error('Replication setup failed', error.stack);
    }
  }

  private async ensurePublicationExists() {
    const result = await this.em.execute(
      `SELECT 1 FROM pg_publication WHERE pubname = 'user_publi'`,
    );

    if (result.length === 0) {
      await this.em.execute(
        `CREATE PUBLICATION user_publi FOR TABLE public.user`,
      );
    }
  }

  private async ensureSubscriptionExists() {
    const result = await this.em2.execute(
      `SELECT 1 FROM pg_subscription WHERE subname = 'user_subscri'`,
    );

    if (result.length === 0) {
      this.em2
        .execute(
          `
          CREATE SUBSCRIPTION user_subscri CONNECTION 'host=localhost dbname=test user=postgres password=Secure@123'
          PUBLICATION user_publi
          WITH (copy_data = false, create_slot = false, slot_name='user_subscri_slot')
        `,
        )
        .then(async () => {
          await this.ensureSubscriptionSlotExist();
        });
    }
  }

  private async ensureSubscriptionSlotExist() {
    const result = await this.em.execute(
      `select 1 from pg_replication_slots where slot_name = 'user_subscri_slot'`,
    );

    if (result.length === 0) {
      await this.em.execute(
        `SELECT * FROM pg_create_logical_replication_slot('user_subscri_slot', 'pgoutput')`,
      );
    }
  }
}
