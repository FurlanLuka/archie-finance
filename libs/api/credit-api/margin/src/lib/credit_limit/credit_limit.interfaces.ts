export interface CreditLimitIncreasedPayload {
  userId: string;
  amount: number;
}

export interface CreditLimitDecreasedPayload {
  userId: string;
  amount: number;
}
