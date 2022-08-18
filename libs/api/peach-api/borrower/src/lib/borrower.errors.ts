import { NotFoundException } from '@nestjs/common';

export class BorrowerNotFoundError extends NotFoundException {
  constructor() {
    super('BORROWER_NOT_FOUND_ERROR');
  }
}

export class PlaidPaymentInstrumentNotFoundError extends NotFoundException {
  constructor() {
    super('PLAID_PAYMENT_INSTRUMENT_NOT_FOUND');
  }
}
