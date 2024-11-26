import { Entity, Enum, Property, PrimaryKey } from '@mikro-orm/core';

export enum SubscriptionStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum Subscription {
  TierOne = 'tier-one',
  TierTwo = 'tier-two',
  None = 'none',
}

@Entity()
export class Tenant {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Enum({
    items: () => SubscriptionStatus,
    default: SubscriptionStatus.Inactive,
  })
  subScriptionStatus = SubscriptionStatus.Inactive;

  @Enum({ items: () => Subscription, default: Subscription.None })
  subScription = Subscription.None;

  @Property()
  churchEmail: string;

  @Property()
  adminEmail: string;

  @Property()
  phoneNumber: string;

  @Property()
  churchName: string;

  @Property()
  adminFirstName: string;

  @Property()
  adminLastName: string;

  @Property({ hidden: true })
  passwordHash?: string;

  @Property({ hidden: true })
  passwordResetKey?: string;
}
