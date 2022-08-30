export class CreditBalanceUpdatedPayload {
  userId: string;
  availableCreditAmount: number;
  creditLimitAmount: number;
  utilizationAmount: number;
  calculatedAt: string;
  paymentDetails: {
    asset: string;
    amount: number;
  };
}
