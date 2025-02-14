import { ClerkClient } from '@clerk/backend';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from 'src/dtos/user.dto';
import HttpContext from 'src/misc/http-context.middleware';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);
  constructor(
    @Inject('ClerkClient') private readonly clerkClient: ClerkClient,
  ) {}

  async getUprotectedData(input: CreateUserInput) {
    try {
      //
      // const invitations = await this.clerkClient.invitations.getInvitationList()
      // invitations.data.map((x)=> x.)

      // const organization =
      //   await this.clerkClient.organizations.createOrganization({
      //     name: 'Pent House',
      //     // createdBy: uuidv7(),
      //     createdBy: 'user_2scI9XF8kPvQl1pDPuti9EDyltg',
      //     maxAllowedMemberships: 100,
      //     publicMetadata: {
      //       website: 'https://penthouse.com',
      //       noOfEmployees: 60,
      //       subscriptionType: 'base',
      //       organizationEmail: 'penthouse@yahoo.com',
      //     },
      //   });

      const organization = await this.clerkClient.organizations.getOrganization(
        { organizationId: 'org_2shjMO8DmqsgEhLhukTV6PIK9mf' },
      );

      // const user = await this.clerkClient.users.createUser({
      //   password: input.password,
      //   firstName: input.firstName,
      //   lastName: input.lastName,
      //   emailAddress: [input.email],
      //   // phoneNumber: [input.phoneNumber],
      //   externalId: uuidv7(),
      // });

      // const user = await this.clerkClient.users.getUser(
      //   'user_2shkTKstxMRYa6vuDQAAKD8da7w',
      // );

      // const invitation = await this.clerkClient.invitations.createInvitation({
      //   emailAddress: input.email,
      //   ignoreExisting: true,
      //   publicMetadata: {
      //     ...input,
      //   },
      //   // redirectUrl: 'http://localhost:3000/accepted',
      // });

      const membership =
        await this.clerkClient.organizations.createOrganizationInvitation({
          emailAddress: input.email,
          role: 'org:super_admin',
          organizationId: organization.id,
          inviterUserId: 'user_2scI9XF8kPvQl1pDPuti9EDyltg',
          publicMetadata: {
            ...input,
          },
          // organizationId: organization.id,
        });

      return { organization, membership };
    } catch (error) {
      console.log(error);
    }
  }

  async getClerkData() {
    // const invitations = await this.clerkClient.invitations;
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
