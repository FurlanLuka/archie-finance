import { BadRequestException } from '@nestjs/common';

export class CreateCreditMinimumCollateralError extends BadRequestException {
  constructor(minimumCredit: number) {
    super(
      'ERR_CREATE_CREDIT_MINIMUM_COLLATERAL',
      `Collateralized assets must be worth at least ${minimumCredit} USD`,
    );
  }
}
