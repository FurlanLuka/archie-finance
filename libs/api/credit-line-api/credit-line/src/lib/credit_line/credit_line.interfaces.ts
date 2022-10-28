import { CreditLimitAssetAllocation } from '@archie/api/credit-line-api/data-transfer-objects/types';
import BigNumber from 'bignumber.js';

export interface CreditLimitAssetAllocationReducerResponse {
  remaining: BigNumber;
  assets: CreditLimitAssetAllocation[];
}
