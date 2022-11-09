import { AmountType, AutopayOptions, PaymentFrequency } from './peach-api.interfaces';

export type CreateAutopay = AutopayOptions;

export interface CreateAutopayDocument {
  paymentInstrumentId: string;
}

export interface AutopayAgreement {
  id: string;
  document: string;
}

export interface AutopayResponse {
  type: AmountType;
  extraAmount: number;
  isAlignedToDueDates: boolean;
  paymentFrequency: PaymentFrequency;
  paymentInstrumentId: string;
  cancelReason: string;
  schedule: AutopaySchedule[];
}

interface AutopaySchedule {
  date: string;
  paymentType: string;
  status: string;
  amount: number;
  originalAmount: number;
  principalAmount: number;
  interestAmount: number;
}
