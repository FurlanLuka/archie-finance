import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '../../interfaces';

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
      scope: 'read:users update:users',
    });
    
  }

  getManagmentClient(): ManagementClient {
    return this.managmentClient;
  }
}
