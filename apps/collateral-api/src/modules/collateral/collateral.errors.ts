import { InternalServerErrorException } from '@nestjs/common';

export class DepositCreationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_DEPOSIT_ERROR');
    this.metadata = metadata;
  }
}
