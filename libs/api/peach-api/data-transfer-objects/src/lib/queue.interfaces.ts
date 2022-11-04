export enum PaymentType {
  liquidation = 'liquidation',
  payment = 'payment',
  purchase = 'purchase',
}

export interface CreditBalanceUpdatedPayload {
  userId: string;
  availableCreditAmount: number;
  creditLimitAmount: number;
  utilizationAmount: number;
  calculatedAt: string;
  paymentDetails?: {
    type: PaymentType;
    asset: string;
    amount: number | string;
    id: string;
  };
}

export interface GetLoanBalancesPayload {
  userId: string;
}

export interface GetLoanBalancesResponse {
  totalCredit: number;
  availableCredit: number;
  utilizationAmount: number;
  calculatedAt: string;
}
