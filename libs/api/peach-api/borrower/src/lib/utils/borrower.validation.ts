import { Borrower } from '../borrower.entity';
import {
  BorrowerHomeAddressNotFoundError,
  BorrowerMailNotFoundError,
  BorrowerNotFoundError,
  CreditLineNotFoundError,
  DrawNotFoundError,
} from '../borrower.errors';
import {
  BorrowerWithCreditLine,
  BorrowerWithDraw,
  BorrowerWithHomeAddress,
  BorrowerWithMail,
} from './borrower.validation.interfaces';

export class BorrowerValidation {
  public isBorrowerDefined(
    borrower: Borrower | null,
  ): asserts borrower is Borrower {
    if (borrower === null || borrower?.personId === null) {
      throw new BorrowerNotFoundError();
    }
  }

  public isBorrowerHomeAddressDefined(
    borrower: Borrower | null,
  ): asserts borrower is BorrowerWithHomeAddress {
    this.isBorrowerDefined(borrower);

    if (borrower.homeAddressContactId === null) {
      throw new BorrowerHomeAddressNotFoundError();
    }
  }

  public isBorrowerMailDefined(
    borrower: Borrower | null,
  ): asserts borrower is BorrowerWithMail {
    this.isBorrowerDefined(borrower);

    if (borrower.encryptedEmail === null) {
      throw new BorrowerMailNotFoundError();
    }
  }

  public isBorrowerCreditLineDefined(
    borrower: Borrower | null,
  ): asserts borrower is BorrowerWithCreditLine {
    this.isBorrowerDefined(borrower);

    if (borrower.creditLineId === null) {
      throw new CreditLineNotFoundError();
    }
  }

  public isBorrowerDrawDefined(
    borrower: Borrower | null,
  ): asserts borrower is BorrowerWithDraw {
    this.isBorrowerCreditLineDefined(borrower);

    if (borrower.drawId === null) {
      throw new DrawNotFoundError();
    }
  }
}
