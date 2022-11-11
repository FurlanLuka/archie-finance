import { MaxWithdrawalAmountResponse } from '@archie/api/ledger-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getMaxWithdrawalAmount } from '../api/get-max-withdrawal-amount';

export const getMaxWithdrawalAmountQueryKey = (assetId: string) => [
  'max_withdrawal_amount',
  assetId,
];

export const useGetMaxWithdrawalAmount = (
  assetId: string,
): QueryResponse<MaxWithdrawalAmountResponse> => {
  return useExtendedQuery(
    getMaxWithdrawalAmountQueryKey(assetId),
    async (accessToken: string) => getMaxWithdrawalAmount(assetId, accessToken),
  );
};
