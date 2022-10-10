import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@archie/api/utils/config';
import * as crypto from 'crypto';
import { CryptoService } from '@archie/api/utils/crypto';
import { ConfigVariables } from '@archie/api/webhook-api/constants';

@Injectable()
export class FireblocksWebhookStrategy extends PassportStrategy(
  Strategy,
  'fireblocks-webhook',
) {
  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {
    super();
  }

  async validate(request: Request): Promise<boolean> {
    if (
      request.headers['fireblocks-signature'] === undefined ||
      request.body === undefined
    ) {
      return false;
    }

    const signature: string = request.headers['fireblocks-signature'];
    const message: string = JSON.stringify(request.body);

    const verifier: crypto.Verify = crypto.createVerify('RSA-SHA512');
    verifier.write(message);
    verifier.end();

    const isVerified: boolean = verifier.verify(
      this.cryptoService.base64decode(
        this.configService.get(ConfigVariables.FIREBLOCKS_PUBLIC_KEY),
      ),
      signature,
      'base64',
    );

    return isVerified;
  }
}
