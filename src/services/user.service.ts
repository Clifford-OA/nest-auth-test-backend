import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/db/entities/user.entity';
import { DynamicDatabaseService } from './dynamic-database.service';
import { CreateUserInput } from 'src/dtos/user.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly dynamicDatabaseService: DynamicDatabaseService) {
    console.log('created');
  }

  async createUser(input: CreateUserInput) {
    const orm = await this.dynamicDatabaseService.getEntityManager();
    let user = await orm.findOne(User, { email: input.email });

    if (user) throw new BadRequestException('Email already exist');

    user = orm.create(User, {
      ...input,
      passwordHash: await bcrypt.hash(input.password, 10),
    });

    await orm.flush();
    return 'successfully created user';
  }

  async getUsers() {
    const orm = await this.dynamicDatabaseService.getEntityManager();
    return await orm.findAndCount(User, {});
  }
}
