export interface CreditLimitAssetAllocation {
  assetId: string;
  allocationPercentage: number;
  allocatedAssetValue: number;
}

export interface CreditLine {
  creditLimit: number;
  creditLimitAssetAllocation: CreditLimitAssetAllocation[];
}

export interface CreditLineUpdatedPayload {
  userId: string;
  creditLimit: number;
  calculatedAt: string;
}

export interface CreditLineCreatedPayload {
  userId: string;
  creditLimit: number;
  ledgerValue: number;
  calculatedAt: string;
}

export interface CreditLineBatchRecalculationCompleted {
  batchId: string;
}
