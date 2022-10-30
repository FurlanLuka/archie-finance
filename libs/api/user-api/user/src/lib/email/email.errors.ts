import { ConflictException, NotFoundException } from '@nestjs/common';

export class EmailNotFoundError extends NotFoundException {
  constructor() {
    super('EMAIL_NOT_FOUND', 'Email was not found.');
  }
}

export class EmailAlreadyVerifiedError extends ConflictException {
  constructor() {
    super('EMAIL_ALREADY_VERIFIED', 'Your email has already been verified.');
  }
}
