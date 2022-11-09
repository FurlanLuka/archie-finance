import {
  CreditLimitAssetAllocation,
  CreditLine,
} from './credit_line.interfaces';

export class CreditLimitAssetAllocationDto
  implements CreditLimitAssetAllocation
{
  assetId: string;
  allocationPercentage: number;
  allocatedAssetValue: number;
}
export class CreditLineDto implements CreditLine {
  creditLimit: number;
  creditLimitAssetAllocation: CreditLimitAssetAllocationDto[];
}
