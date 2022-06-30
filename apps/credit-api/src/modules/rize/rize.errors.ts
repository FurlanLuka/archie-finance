import { ConflictException } from '@nestjs/common';

export class CustomerAlreadyExists extends ConflictException {
  constructor() {
    super('ERR_CUSTOMER_ALREADY_EXISTS');
  }
}
