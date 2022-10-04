export class CreditLimitUpdatedPayload {
  userId: string;
  creditLimit: number;
  calculatedAt: number;
}

export class CreditLimitPeriodicCheckRequestedPayload {
  userIds: string[];
}

export class CreditLineCreatedPayload {
  userId: string;
  amount: number;
  calculatedAt: string;
  downPayment: number;
}

export class CreditLimitResponse {
  creditLimit: number;
  assetLimits: {
    asset: string;
    limit: number;
    utilizationPercentage: number;
  }[];
}
