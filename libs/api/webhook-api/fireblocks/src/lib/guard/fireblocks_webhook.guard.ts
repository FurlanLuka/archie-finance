import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class FireblocksWebhookGuard extends PassportAuthGuard(
  'fireblocks-webhook',
) {}
