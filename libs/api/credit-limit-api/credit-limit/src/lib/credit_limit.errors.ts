import { BadRequestException } from '@nestjs/common';

export class CreateCreditMinimumCollateralError extends BadRequestException {
  constructor(minimumCredit: number) {
    super(
      'ERR_CREATE_CREDIT_MINIMUM_COLLATERAL',
      `Collateralized assets must be worth at least ${minimumCredit} USD`,
    );
  }
}

export class CreditAlreadyExistsError extends BadRequestException {
  constructor() {
    super('ERR_CREDIT_ALREADY_EXISTS', 'Credit line already exists');
  }
}
