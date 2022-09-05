export enum PaymentType {
  liquidation = 'liquidation',
  payment = 'payment',
  purchase = 'purchase',
}

export class CreditBalanceUpdatedPayload {
  userId: string;
  availableCreditAmount: number;
  creditLimitAmount: number;
  utilizationAmount: number;
  calculatedAt: string;
  paymentDetails: {
    type: PaymentType;
    asset: string;
    amount: number;
  };
}

export class GetLoanBalancesPayload {
  userId: string;
}

// TODO do we unify with GetLoanBalancesDto or something?
export interface GetLoanBalancesResponse {
  totalCredit: number;
  availableCredit: number;
  utilizationAmount: number;
}
