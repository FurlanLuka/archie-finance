import { NotFoundException } from '@nestjs/common';

export class CreditNotSetUpError extends NotFoundException {
  constructor() {
    super('CREDIT_NOT_SET_UP');
  }
}
