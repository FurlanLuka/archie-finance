import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/user-api/constants';

@Injectable()
export class Auth0Service {
  private managmentClient: ManagementClient;

  constructor(private configService: ConfigService) {
    this.managmentClient = new ManagementClient({
      domain: this.configService.get(ConfigVariables.AUTH0_M2M_DOMAIN),
      clientId: this.configService.get(ConfigVariables.AUTH0_M2M_CLIENT_ID),
      clientSecret: this.configService.get(
        ConfigVariables.AUTH0_M2M_CLIENT_SECRET,
      ),
      scope:
        'read:users update:users create:guardian_enrollment_tickets delete:guardian_enrollments',
    });
  }

  getManagmentClient(): ManagementClient {
    return this.managmentClient;
  }
}
