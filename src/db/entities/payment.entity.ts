import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Tenant } from './tenant.entity';

export enum TransactionStatus {
  Pending,
  Completed,
  Failed,
}

@Entity({ customRepository: () => PaymentRepository })
export class Payment {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property()
  stripeSessionId: string;

  @Property({ nullable: true })
  stripePaymentId?: string;

  @Property()
  amount: number = 0;

  @ManyToOne(() => Tenant, { ref: true })
  tenant: Ref<Tenant>;

  @Enum({ default: TransactionStatus.Pending })
  status = TransactionStatus.Pending;
}

export class PaymentRepository extends EntityRepository<Payment> {}
