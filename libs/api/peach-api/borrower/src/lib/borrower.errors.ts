import { BadRequestException, NotFoundException } from '@nestjs/common';

export class BorrowerNotFoundError extends NotFoundException {
  constructor() {
    super('BORROWER_NOT_FOUND_ERROR');
  }
}

export class CreditLineNotFoundError extends NotFoundException {
  constructor() {
    super('CREDIT_LINE_NOT_FOUND_ERROR');
  }
}

export class DrawNotFoundError extends NotFoundException {
  constructor() {
    super('CREDIT_LINE_DRAW_NOT_FOUND_ERROR');
  }
}

export class PaymentInstrumentNotFoundError extends NotFoundException {
  constructor() {
    super('PAYMENT_INSTRUMENT_NOT_FOUND');
  }
}

export class AmountExceedsOutstandingBalanceError extends BadRequestException {
  constructor() {
    super('AMOUNT_EXCEEDS_OUTSTANDING_BALANCE');
  }
}

export class AmountExceedsAvailableBalanceError extends NotFoundException {
  constructor() {
    super('AMOUNT_EXCEEDS_AVAILABLE_BALANCE');
  }
}

export class BorrowerMailNotFoundError extends NotFoundException {
  constructor() {
    super('BORROWER_MAIL_NOT_FOUND');
  }
}

export class BorrowerHomeAddressNotFoundError extends NotFoundException {
  constructor() {
    super('BORROWER_HOME_ADDRESS_NOT_FOUND');
  }
}
