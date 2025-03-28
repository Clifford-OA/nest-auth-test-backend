import { Entity, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Role } from '../entities/user.entity';

@Entity({ customRepository: () => SecondUserRepository })
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Enum({ default: Role.User })
  role = Role.User;

  @Property()
  email: string;

  @Property({ default: false })
  emailVerified = false;

  @Property({ hidden: true })
  passwordHash: string;

  @Property({ hidden: true, nullable: true })
  passwordResetKey?: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ persist: false })
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Property({ nullable: true })
  imgUrl?: string;
}

export class SecondUserRepository extends EntityRepository<User> {}
