export interface CreditLimitAssetAllocation {
  assetId: string;
  allocationPercentage: number;
  allocatedAssetValue: number;
}

export interface CreditLine {
  creditLimit: number;
  creditLimitAssetAllocation: CreditLimitAssetAllocation[];
}

export class CreditLineUpdatedPayload {
  userId: string;
  creditLimit: number;
  calculatedAt: string;
}

export class CreditLineCreatedPayload {
  userId: string;
  creditLimit: number;
  ledgerValue: number;
  calculatedAt: string;
}