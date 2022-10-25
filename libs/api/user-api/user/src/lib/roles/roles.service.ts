import { Injectable } from '@nestjs/common';
import { Auth0Service } from '@archie/api/user-api/auth0';

@Injectable()
export class RolesService {
  DEFAULT_ROLE_ID = 'rol_8iZfnq4Ds6hdFojy';

  constructor(private auth0Service: Auth0Service) {}

  async addDefaultRole(userId: string): Promise<void> {
    await this.auth0Service.getManagmentClient().assignRolestoUser(
      { id: userId },
      {
        roles: [this.DEFAULT_ROLE_ID],
      },
    );
  }

  async addDefaultRoleToAllExistingUsers(page = 0): Promise<void> {
    const users = await this.auth0Service.getManagmentClient().getUsers({
      page,
      per_page: 5,
    });

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await sleep(2000);

    await Promise.all(
      users.map(async (user) => {
        await this.auth0Service.getManagmentClient().assignRolestoUser(
          { id: user.user_id! },
          {
            roles: [this.DEFAULT_ROLE_ID],
          },
        );
      }),
    );

    if (users.length > 0) {
      await this.addDefaultRoleToAllExistingUsers(page + 1);
    }
  }
}
