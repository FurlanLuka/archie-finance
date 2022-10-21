import { NotFoundException } from '@nestjs/common';

export class EnrollmentNotFoundError extends NotFoundException {
  constructor() {
    super('ENROLLMENT_NOT_FOUND', 'Enrollment was not found.');
  }
}
