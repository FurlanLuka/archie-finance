import { Body, Controller, Post } from '@nestjs/common';
import { Auth0Logs } from './auth0.interfaces';
import { Auth0Service } from './auth0.service';

@Controller('v1/webhooks/auth0')
export class Auth0Controller {
  constructor(private auth0Service: Auth0Service) {}

  @Post()
  webhook(@Body() payload: Auth0Logs): void {
    this.auth0Service.webhookHandler(payload);
  }
}
