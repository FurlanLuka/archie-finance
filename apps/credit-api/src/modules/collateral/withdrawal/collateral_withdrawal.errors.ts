import { InternalServerErrorException } from '@nestjs/common';

export class WithdrawalCreationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_WITHDRAWAL_ERROR');
    this.metadata = metadata;
  }
}
