import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/webhook-api/constants';

@Injectable()
export class Auth0WebhookStrategy extends PassportStrategy(
  Strategy,
  'auth0-webhook',
) {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(request: Request): Promise<boolean> {
    if (
      request.headers['authorization'] === undefined ||
      request.body === undefined
    ) {
      return false;
    }

    const secretKey: string = request.headers['authorization'];

    return (
      secretKey === this.configService.get(ConfigVariables.AUTH0_WEBHOOK_SECRET)
    );
  }
}
