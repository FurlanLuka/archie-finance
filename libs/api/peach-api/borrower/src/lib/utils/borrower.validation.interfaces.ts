import { Borrower } from '../borrower.entity';

export class BorrowerWithHomeAddress extends Borrower {
  homeAddressContactId: string;
}

export class BorrowerWithMail extends Borrower {
  encryptedEmail: string;
}

export class BorrowerWithCreditLine {
  creditLineId: string;
}

export class BorrowerWithDraw extends BorrowerWithCreditLine {
  creditLineId: string;
}
