import { Migration } from '@mikro-orm/migrations';

export class Migration20250328175808 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null default gen_random_uuid(), "role" smallint not null default 0, "email" varchar(255) not null, "email_verified" varchar(255) not null default false, "password_hash" varchar(255) not null, "password_reset_key" varchar(255) null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "img_url" varchar(255) null, constraint "user_pkey" primary key ("id"));');
  }

}
