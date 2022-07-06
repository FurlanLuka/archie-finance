import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class KycNotFoundError extends NotFoundException {
  constructor() {
    super(
      'KYC_NOT_FOUND',
      'KYC record not found. Please submit your KYC or contact support.',
    );
  }
}

export class KycAlreadySubmitted extends BadRequestException {
  constructor() {
    super(
      'KYC_ALREADY_SUBMITTED',
      'You have already submitted your KYC. If you made a mistake, please contact support.',
    );
  }
}

export class KycRecordCreationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super(
      'ERR_CREATING_KYC_RECORD',
      'There was an issue creating KYC record. Please try again or contact support.',
    );
    this.metadata = metadata;
  }
}
