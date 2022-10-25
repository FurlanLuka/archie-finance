import { Injectable } from '@nestjs/common';
import { Auth0Service } from '@archie/api/user-api/auth0';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/user-api/constants';

@Injectable()
export class RolesService {
  DEFAULT_ROLE_ID;

  constructor(
    private auth0Service: Auth0Service,
    private configService: ConfigService,
  ) {
    this.DEFAULT_ROLE_ID = configService.get(ConfigVariables.DEFAULT_ROLE_ID);
  }

  async addDefaultRole(userId: string): Promise<void> {
    await this.auth0Service.getManagmentClient().assignRolestoUser(
      { id: userId },
      {
        roles: [this.DEFAULT_ROLE_ID],
      },
    );
  }
}
