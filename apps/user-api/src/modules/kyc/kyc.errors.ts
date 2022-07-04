import { BadRequestException, NotFoundException } from '@nestjs/common';

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
