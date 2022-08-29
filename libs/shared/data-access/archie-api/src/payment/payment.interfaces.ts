export interface UserObligations {
  dueDate: string;
  balanceOwed: number;
  fullBalance: number;
  interestOwed: number;
}

export const MISSING_PAYMENT_INFO_ERROR = 'MISSING_PAYMENT_INFO_ERROR';
export const CREDIT_LINE_NOT_FOUND_ERROR = 'CREDIT_LINE_NOT_FOUND_ERROR';
