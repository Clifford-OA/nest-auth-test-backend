import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { SecondDatabaseService } from './db.service';

@Injectable()
export class ReplicationService {
  private readonly logger = new Logger(ReplicationService.name);
  private em2: EntityManager;

  constructor(
    private readonly em: EntityManager,
    private readonly dbService: SecondDatabaseService,
  ) {}

  async onModuleInit() {
    try {
      this.em2 =
        (await this.dbService.waitForInitialization()) as EntityManager;
      await this.setupLogicalReplication();
    } finally {
      await this.dbService.close();
    }
  }

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
      `SELECT 1 FROM pg_publication WHERE pubname = 'user_publication'`,
    );

    if (result.length === 0) {
      await this.em.execute(
        `CREATE PUBLICATION user_publication FOR TABLE public.user`,
      );
    }
  }

  private async ensureSubscriptionExists() {
    const result = await this.em2.execute(
      `SELECT 1 FROM pg_subscription WHERE subname = 'user_subscription'`,
    );

    if (result.length === 0) {
      this.em2
        .execute(
          `
        CREATE SUBSCRIPTION user_subscription CONNECTION 'host=localhost dbname=test-auth user=postgres password=Secure@123'
        PUBLICATION user_publication
        WITH (copy_data = false, create_slot = false, slot_name='user_subscription_slot')
      `,
        )
        .then(async () => {
          await this.ensureSubscriptionSlotExist();
        });
    }
  }

  private async ensureSubscriptionSlotExist() {
    const result = await this.em.execute(
      `select 1 from pg_replication_slots where slot_name = 'user_subscription_slot'`,
    );

    if (result.length === 0) {
      await this.em.execute(
        `SELECT * FROM pg_create_logical_replication_slot('user_subscription_slot', 'pgoutput')`,
      );
    }
  }
}
//
