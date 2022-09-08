export class CreditLimitDecreasedPayload {
  userId: string;
  amount: number;
  creditLimit: number;
  calculatedAt: string;
}

export class CreditLimitIncreasedPayload {
  userId: string;
  amount: number;
  creditLimit: number;
  calculatedAt: string;
}

export class CreditLimitPeriodicCheckRequestedPayload {
  userIds: string[];
}

export class CreditLineCreatedPayload {
  userId: string;
  amount: number;
}
