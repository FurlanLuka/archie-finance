export const AUTOPAY_NOT_CONFIGURED = 'AUTOPAY_NOT_CONFIGURED';

export interface Autopay {
  type: AmountType;
  extraAmount: number;
  isAlignedToDueDates: boolean;
  paymentFrequency: PaymentFrequency;
  paymentInstrumentId: string;
  cancelReason: string;
  schedule: AutopaySchedule[];
}

export interface AutopaySchedule {
  date: string;
  paymentType: string;
  status: string;
  amount: number;
  originalAmount: number;
  principalAmount: number;
  interestAmount: number;
}

export enum AmountType {
  statementMinimumAmount = 'statementMinimumAmount',
  statementMinimumAmountPlusExtra = 'statementMinimumAmountPlusExtra',
  statementBalanceAmount = 'statementBalanceAmount',
}

export interface AutopayOptions {
  amountType: AmountType;
  extraAmount?: number | null;
  paymentInstrumentId: string;
  isAlignedToDueDates: boolean;
  offsetFromDueDate?: number[] | null;
  agreementDocumentId: string;
}

export enum PaymentFrequency {
  twiceMonthly = 'twiceMonthly',
  everyTwoWeeks = 'everyTwoWeeks',
  monthly = 'monthly',
}
