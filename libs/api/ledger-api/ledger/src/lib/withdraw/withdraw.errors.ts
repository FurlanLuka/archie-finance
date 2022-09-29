import { BadRequestException, NotFoundException } from '@nestjs/common';

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

export class InvalidAssetError extends BadRequestException {
  metadata: object;

  constructor(metadata: object) {
    super('INVALID_ASSET');
    this.metadata = metadata;
  }
}

export class WithdrawalRecordNotFoundError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('WITHDRAWAL_RECORD_NOT_FOUND');
    this.metadata = metadata;
  }
}
