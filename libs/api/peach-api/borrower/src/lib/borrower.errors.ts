import { NotFoundException } from '@nestjs/common';

export class BorrowerNotFoundError extends NotFoundException {
  constructor() {
    super('BORROWER_NOT_FOUND_ERROR');
  }
}
