import { InternalServerErrorException } from '@nestjs/common';

export class FireblocksWebhookError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('FIREBLOCKS_WEBHOOK_ERROR');
    this.metadata = metadata;
  }
}
