import { Injectable, Logger } from '@nestjs/common';
import { Customer, DebitCard } from '../api/rize_api.interfaces';
import {
  ActiveCustomerDoesNotExist,
  CustomerAlreadyExists,
  DebitCardDoesNotExist,
} from '../rize.errors';

@Injectable()
export class RizeValidatorService {
  public validateCustomerExists(customer: Customer | null) {
    if (customer === null || customer.status !== 'active') {
      throw new ActiveCustomerDoesNotExist();
    }
  }

  public validateCustomerDoesNotExist(customer: Customer | null) {
    if (customer !== null && customer.status === 'active') {
      throw new CustomerAlreadyExists();
    }
  }

  public validateDebitCardExists(debitCard: DebitCard | null) {
    if (debitCard === null) {
      throw new DebitCardDoesNotExist();
    }
  }
}
