import { Borrower } from '../borrower.entity';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
  DrawNotFoundError,
} from '../borrower.errors';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BorrowerValidation {
  public isBorrowerDefined(borrower: Borrower | null): void {
    if (borrower === null || borrower?.personId === null) {
      throw new BorrowerNotFoundError();
    }
  }

  public isBorrowerCreditLineDefined(borrower: Borrower | null): void {
    this.isBorrowerDefined(borrower);

    if (borrower.creditLineId === null) {
      throw new CreditLineNotFoundError();
    }
  }

  public isBorrowerDrawDefined(borrower: Borrower | null): void {
    this.isBorrowerCreditLineDefined(borrower);

    if (borrower.drawId === null) {
      throw new DrawNotFoundError();
    }
  }
}
