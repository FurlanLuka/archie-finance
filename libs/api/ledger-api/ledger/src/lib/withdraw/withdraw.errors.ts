import { BadRequestException } from '@nestjs/common';

export class InvalidWithdrawalAmountError extends BadRequestException {
  metadata: object;

  constructor(metadata: object) {
    super('INVALID_WITHDRAWAL_AMOUNT');
    this.metadata = metadata;
  }
}

export class WithdrawalAmountTooHighError extends BadRequestException {
  metadata: object;

  constructor(metadata: object) {
    super('WITHDRAWAL_AMOUNT_TOO_HIGH');
    this.metadata = metadata;
  }
}
