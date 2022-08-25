import { Borrower } from '../borrower.entity';
import {
  BorrowerHomeAddressNotFoundError,
  BorrowerMailNotFoundError,
  BorrowerNotFoundError,
  CreditLineNotFoundError,
  DrawNotFoundError,
} from '../borrower.errors';
import {
  BorrowerWithHomeAddress,
  BorrowerWithMail,
} from './borrower.validation.interfaces';

export class BorrowerValidation {
  public isBorrowerDefined(borrower: Borrower | null): Borrower {
    if (borrower === null || borrower?.personId === null) {
      throw new BorrowerNotFoundError();
    }

    return borrower;
  }

  public isBorrowerHomeAddressDefined(
    borrower: Borrower | null,
  ): BorrowerWithHomeAddress {
    const definedBorrower: Borrower = this.isBorrowerDefined(borrower);

    if (definedBorrower.homeAddressContactId === null) {
      throw new BorrowerHomeAddressNotFoundError();
    }

    return <BorrowerWithHomeAddress>definedBorrower;
  }

  public isBorrowerMailDefined(
    borrower: Borrower | null,
  ): asserts borrower is BorrowerWithMail {
    const definedBorrower: Borrower = this.isBorrowerDefined(borrower);

    if (definedBorrower.encryptedEmail === null) {
      throw new BorrowerMailNotFoundError();
    }
  }

  public isBorrowerCreditLineDefined(borrower: Borrower | null): Borrower {
    const definedBorrower: Borrower = this.isBorrowerDefined(borrower);

    if (definedBorrower.creditLineId === null) {
      throw new CreditLineNotFoundError();
    }

    return definedBorrower;
  }

  public isBorrowerDrawDefined(borrower: Borrower | null): Borrower {
    const definedBorrower: Borrower =
      this.isBorrowerCreditLineDefined(borrower);

    if (definedBorrower.drawId === null) {
      throw new DrawNotFoundError();
    }

    return definedBorrower;
  }
}
