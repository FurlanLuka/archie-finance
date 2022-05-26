import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@archie-microservices/config';
import * as crypto from 'crypto';
import { base64decode } from 'nodejs-base64';
import { ConfigVariables } from 'apps/monolith-api/src/interfaces';

@Injectable()
export class FireblocksWebhookStrategy extends PassportStrategy(
  Strategy,
  'fireblocks-webhook',
) {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(request: Request): Promise<boolean> {
    const signature: string = request.headers['fireblocks-signature'];
    const message: string = JSON.stringify(request.body);

    const verifier: crypto.Verify = crypto.createVerify('RSA-SHA512');
    verifier.write(message);
    verifier.end();

    const isVerified: boolean = verifier.verify(
      base64decode(
        this.configService.get(ConfigVariables.FIREBLOCKS_PUBLIC_KEY),
      ),
      signature,
      'base64',
    );

    return isVerified;
  }
}
