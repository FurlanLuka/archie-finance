import { Injectable } from '@nestjs/common';
import { Customer, DebitCard } from '../api/rize_api.interfaces';
import {
  ActiveCustomerDoesNotExist,
  CustomerAlreadyExists,
  DebitCardDoesNotExist,
} from '../rize.errors';

@Injectable()
export class RizeValidatorService {
  public validateCustomerExists(
    customer: Customer | null,
  ): asserts customer is Customer {
    if (customer === null || customer.status !== 'active') {
      throw new ActiveCustomerDoesNotExist();
    }
  }

  public validateCustomerDoesNotExist(
    customer: Customer | null,
  ): asserts customer is Customer {
    if (customer !== null && customer.status === 'active') {
      throw new CustomerAlreadyExists();
    }
  }

  public validateDebitCardExists(
    debitCard: DebitCard | null,
  ): asserts debitCard is DebitCard {
    if (debitCard === null) {
      throw new DebitCardDoesNotExist();
    }
  }
}
