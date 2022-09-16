import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getMaxWithdrawalAmount, MaxWithdrawalAmount } from '../api/get-max-withdrawal-amount';

export const useGetMaxWithdrawalAmount = (assetId: string): QueryResponse<MaxWithdrawalAmount> => {
  const MAX_WITHDRAWAL_AMOUNT_QUERY_KEY = `max_withdrawal_amount_${assetId}`;

  return useExtendedQuery(
    MAX_WITHDRAWAL_AMOUNT_QUERY_KEY, 
    async (accessToken: string) => getMaxWithdrawalAmount(assetId, accessToken),
    { enabled: false },
  );
};
