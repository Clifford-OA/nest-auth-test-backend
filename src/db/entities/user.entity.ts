import { Entity, Enum, Property, PrimaryKey } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

export enum Role {
  User,
  Admin,
}

@Entity({ customRepository: () => UserRepository })
export class User {
  @PrimaryKey()
  id: string;

  @Enum({ default: Role.User })
  role = Role.User;

  @Property()
  email: string;

  @Property({ default: false })
  emailVerified = false;

  @Property({ hidden: true })
  passwordHash?: string;

  @Property({ hidden: true })
  passwordResetKey?: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ persist: false })
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Property()
  imgUrl?: string;
}

export class UserRepository extends EntityRepository<User> {}
