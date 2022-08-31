export enum PaymentType {
  liquidation = 'liquidation',
  payment = 'payment',
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
