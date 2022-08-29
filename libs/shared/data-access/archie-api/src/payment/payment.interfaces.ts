export interface UserObligations {
  dueDate: string;
  balanceOwed: number;
  fullBalance: number;
  interestOwed: number;
}

export const MISSING_PAYMENT_INFO_ERROR = 'MISSING_PAYMENT_INFO_ERROR';
export const BORROWER_NOT_FOUND_ERROR = 'BORROWER_NOT_FOUND_ERROR';
