import { CreditLimitAssetAllocation } from '@archie/api/credit-line-api/data-transfer-objects/types';
import BigNumber from 'bignumber.js';
import { GroupMap } from '@archie/api/utils/helpers';
import { CreditLine } from './credit_line.entity';

export interface CreditLimitAssetAllocationReducerResponse {
  remaining: BigNumber;
  assets: CreditLimitAssetAllocation[];
}

export type CreditLinePerUser = GroupMap<CreditLine>;
