import { InternalServerErrorException } from '@nestjs/common';

export class AddToEmailWaitlistInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('ADD_TO_EMAIL_WAITLIST_ERROR');
    this.metadata = metadata;
  }
}

export class SendEmailInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('ERROR_SENDING_EMAIL');
    this.metadata = metadata;
  }
}
