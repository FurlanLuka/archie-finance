import { ConflictException, NotFoundException } from '@nestjs/common';

export class CustomerAlreadyExists extends ConflictException {
  constructor() {
    super('ERR_CUSTOMER_ALREADY_EXISTS');
  }
}

export class ActiveCustomerDoesNotExist extends NotFoundException {
  constructor() {
    super('ERR_ACTIVE_CUSTOMER_DOES_NOT_EXIST');
  }
}
