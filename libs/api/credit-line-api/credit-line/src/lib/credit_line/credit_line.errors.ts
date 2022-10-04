import { BadRequestException, NotFoundException } from '@nestjs/common';

export class NotEnoughCollateralError extends BadRequestException {
  metadata: object;

  constructor(metadata: object) {
    super('NOT_ENOUGH_COLLATERAL');
    this.metadata = metadata;
  }
}

export class CreditLineAlreadyExistsError extends BadRequestException {
  metadata: object;

  constructor(metadata: object) {
    super('CREDIT_LINE_ALREADY_EXISTS');
    this.metadata = metadata;
  }
}

export class CreditLineNotFoundError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('CREDIT_LINE_RECORD_NOT_FOUND');
    this.metadata = metadata;
  }
}
