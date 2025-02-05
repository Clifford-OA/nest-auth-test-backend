import { ClerkClient } from '@clerk/backend';
import { Inject, Injectable } from '@nestjs/common';
import HttpContext from 'src/misc/http-context.middleware';

@Injectable()
export class ClerkService {
  constructor(
    @Inject('ClerkClient') private readonly clerkClient: ClerkClient,
  ) {}

  async getUprotectedData() {
    return 'this is unprotected data.';
  }

  async getData() {
    const user = HttpContext.get().req.user;

    return {
      user,
      data: 'Clifford Osei',
    };

    // const results = await this.clerkClient.users.createUser({
    //   firstName: input.firstName,
    //   lastName: input.lastName,
    //   emailAddress: [input.email],
    //   password: input.password,
    //   phoneNumber: [input.phoneNumber],
    // });
    // return results;
  }
}
