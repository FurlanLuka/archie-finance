import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@archie/api/utils/config';
import { CryptoService } from '@archie/api/utils/crypto';
import { ConfigVariables } from '@archie/api/webhook-api/constants';

interface RequestWithRawBody extends Request {
  rawBody: Buffer | undefined;
}

@Injectable()
export class PeachWebhookStrategy extends PassportStrategy(
  Strategy,
  'peach-webhook',
) {
  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {
    super();
  }

  async validate(request: Request): Promise<boolean> {
    const peachHmac: string | undefined = request.headers['x-peach-hmac'];

    const rawBody: Buffer | undefined = (<RequestWithRawBody>(<unknown>request))
      ?.rawBody;

    if (peachHmac === undefined || rawBody === undefined) {
      return false;
    }

    const hmac: string = this.cryptoService.computeHmac(
      this.configService.get(ConfigVariables.PEACH_HMAC_SECRET),
      rawBody,
    );

    return hmac === peachHmac;
  }
}
