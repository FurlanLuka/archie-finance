import {
  CreditLimitAssetAllocation,
  CreditLine,
} from './credit_line.interfaces';

export class CreditLineDto implements CreditLine {
  creditLimit: number;
  creditLimitAssetAllocation: CreditLimitAssetAllocation[];
}
