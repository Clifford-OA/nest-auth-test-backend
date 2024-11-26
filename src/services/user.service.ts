import { Injectable } from '@nestjs/common';
import { UpdateUserInput } from 'src/dtos/user.dto';

@Injectable()
export class UserService {
  updateUser(input: UpdateUserInput) {
    console.log('updating user.......');
  }
}
