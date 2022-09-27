import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class LedgerAccountNotFoundError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('LEDGER_NOT_FOUND');
    this.metadata = metadata;
  }
}

export class InvalidLedgerDeductionAmountError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('LEDGER_NOT_FOUND');
    this.metadata = metadata;
  }
}
