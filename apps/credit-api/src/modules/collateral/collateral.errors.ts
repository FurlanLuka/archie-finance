import { InternalServerErrorException } from '@nestjs/common';

export class DepositCreationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_DEPOSIT_ERROR');
    this.metadata = metadata;
  }
}

export class WithdrawalCreationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_WITHDRAWAL_ERROR');
    this.metadata = metadata;
  }
}
