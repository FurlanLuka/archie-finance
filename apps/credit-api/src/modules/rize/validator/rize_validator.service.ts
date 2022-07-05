import { Injectable, Logger } from '@nestjs/common';
import { Customer, DebitCard } from '../api/rize_api.interfaces';
import {
  ActiveCustomerDoesNotExist,
  CustomerAlreadyExists,
  DebitCardAlreadyExists,
  DebitCardDoesNotExist,
} from '../rize.errors';

@Injectable()
export class RizeValidatorService {
  public validateCustomerExists(customer: Customer | null) {
    if (customer === null || customer.status !== 'active') {
      Logger.error({
        code: 'CUSTOMER_DOES_NOT_EXIST',
        metadata: {
          userId: customer.external_uid,
          customerId: customer.uid,
        },
      });

      throw new ActiveCustomerDoesNotExist();
    }
  }

  public validateCustomerDoesNotExist(customer: Customer | null) {
    if (customer === null || customer.status !== 'active') {
      Logger.error({
        code: 'CUSTOMER_ALREADY_EXISTS',
        metadata: {
          userId: customer.external_uid,
          customerId: customer.uid,
        },
      });

      throw new CustomerAlreadyExists();
    }
  }

  public validateDebitCardDoesNotExist(debitCard: DebitCard | null) {
    if (debitCard !== null) {
      Logger.error({
        code: 'DEBIT_CARD_ALREADY_EXISTS',
        metadata: {
          userId: debitCard.external_uid,
          debitCardId: debitCard.uid,
        },
      });

      throw new DebitCardAlreadyExists();
    }
  }

  public validateDebitCardExists(debitCard: DebitCard | null) {
    if (debitCard === null) {
      Logger.error({
        code: 'DEBIT_CARD_DOES_NOT_EXIST',
        metadata: {
          userId: debitCard.external_uid,
          debitCardId: debitCard.uid,
        },
      });

      throw new DebitCardDoesNotExist();
    }
  }
}
