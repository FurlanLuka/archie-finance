import { InternalServerErrorException } from '@nestjs/common';

export class WithdrawalCreationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_WITHDRAWAL_ERROR');
    this.metadata = metadata;
  }
}

export class WithdrawalInitializeInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('INITIALIZE_WITHDRAWAL_ERROR');
    this.metadata = metadata;
  }
}

export class CollateralNotFoundError extends InternalServerErrorException {
  constructor() {
    super('COLLATERAL_NOT_FOUND');
  }
}
