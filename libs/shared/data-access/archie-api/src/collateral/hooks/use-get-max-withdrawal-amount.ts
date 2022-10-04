import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getMaxWithdrawalAmount, MaxWithdrawalAmount } from '../api/get-max-withdrawal-amount';

export const getMaxWithdrawalAmountQueryKey = (assetId: string) => `max_withdrawal_amount_${assetId}`;

export const useGetMaxWithdrawalAmount = (assetId: string): QueryResponse<MaxWithdrawalAmount> => {
  return useExtendedQuery(getMaxWithdrawalAmountQueryKey(assetId), async (accessToken: string) =>
    getMaxWithdrawalAmount(assetId, accessToken),
  );
};
