import { InternalServerErrorException } from '@nestjs/common';

export class SendEmailInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('ERROR_SENDING_EMAIL');
    this.metadata = metadata;
  }
}
