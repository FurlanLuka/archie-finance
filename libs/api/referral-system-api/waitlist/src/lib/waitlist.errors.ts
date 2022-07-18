import { InternalServerErrorException } from '@nestjs/common';

export class EmailVerificationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('ERROR_VERIFYING_WAITLIST_EMAIL');
    this.metadata = metadata;
  }
}
