import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

type ReplicationType = {
  pubName: string;
  subName: string;
  tableName: string;
  slotName: string;
};

@Injectable()
export class ReplicationService {
  private readonly logger = new Logger(ReplicationService.name);

  constructor(private readonly em: EntityManager) {}

  // async onModuleInit() {
  //   try {
  //     this.em2 =
  //       (await this.dbService.waitForInitialization()) as EntityManager;
  //     await this.setupLogicalReplication();
  //   } finally {
  //     await this.dbService.close();
  //   }
  // }

  async setupLogicalReplication(em2: EntityManager) {
    const replicationItems: ReplicationType[] = [
      {
        pubName: 'user_publi',
        subName: 'user_subscri',
        slotName: 'user_subscri_slot',
        tableName: 'public.user',
      },
      {
        pubName: 'employee_publi',
        subName: 'employee_subscri',
        slotName: 'employee_subscri_slot',
        tableName: 'public.employees',
      },
    ];

    try {
      await Promise.all(
        replicationItems.map(async (item) => {
          // 1. Ensure publication exists on publisher
          await this.ensurePublicationExists(item);

          // 2. Ensure subscription exists on subscriber
          await this.ensureSubscriptionExists(em2, item);
        }),
      );

      this.logger.log('Database replication setup completed');
    } catch (error) {
      this.logger.error('Replication setup failed', error.stack);
    }
  }

  private async ensurePublicationExists(item: ReplicationType) {
    const result = await this.em.execute(
      `SELECT 1 FROM pg_publication WHERE pubname = '${item.pubName}'`,
    );

    if (result.length === 0) {
      await this.em.execute(
        `CREATE PUBLICATION ${item.pubName} FOR TABLE ${item.tableName}`,
      );
    }
  }

  private async ensureSubscriptionExists(
    em2: EntityManager,
    item: ReplicationType,
  ) {
    const result = await em2.execute(
      `SELECT 1 FROM pg_subscription WHERE subname = '${item.subName}'`,
    );

    if (result.length === 0) {
      em2
        .execute(
          `
          CREATE SUBSCRIPTION ${item.subName} CONNECTION 'host=localhost dbname=test user=postgres password=Secure@123'
          PUBLICATION ${item.pubName}
          WITH (copy_data = false, create_slot = false, slot_name='${item.slotName}')
        `,
        )
        .then(async () => {
          await this.ensureSubscriptionSlotExist(item);
        });
    }
  }

  private async ensureSubscriptionSlotExist(item: ReplicationType) {
    const result = await this.em.execute(
      `select 1 from pg_replication_slots where slot_name = '${item.slotName}'`,
    );

    if (result.length === 0) {
      await this.em.execute(
        `SELECT * FROM pg_create_logical_replication_slot('${item.slotName}', 'pgoutput')`,
      );
    }
  }
}
//
