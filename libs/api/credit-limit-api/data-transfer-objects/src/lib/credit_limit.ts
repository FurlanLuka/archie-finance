export class CreditLimitUpdatedPayload {
  userId: string;
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

export class CreditLimitResponse {
  creditLimit: number;
  assetLimits: {
    asset: string;
    limit: number;
    utilizationPercentage: number;
  }[];
}
