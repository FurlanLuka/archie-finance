import { NotFoundException } from '@nestjs/common';

export class BorrowerNotFoundError extends NotFoundException {
  constructor() {
    super('BORROWER_NOT_FOUND_ERROR');
  }
}

export class PaymentInstrumentNotFoundError extends NotFoundException {
  constructor() {
    super('PAYMENT_INSTRUMENT_NOT_FOUND');
  }
}

export class AmountExceedsOutstandingBalanceError extends NotFoundException {
  constructor() {
    super('AMOUNT_EXCEEDS_OUTSTANDING_BALANCE');
  }
}

export class AmountExceedsAvailableBalanceError extends NotFoundException {
  constructor() {
    super('AMOUNT_EXCEEDS_AVAILABLE_BALANCE');
  }
}
