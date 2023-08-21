import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/entities/user.entity';
import { UpdateUserInput } from 'src/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  updateUser(input: UpdateUserInput) {
    console.log('updating user.......');
  }
}
