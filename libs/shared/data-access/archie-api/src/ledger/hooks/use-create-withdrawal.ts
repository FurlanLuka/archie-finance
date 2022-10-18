import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createWithdrawal, CreateWithdrawalBody, WithdrawalResponse } from '../api/create-withdrawal';

import { getMaxWithdrawalAmountQueryKey } from './use-get-max-withdrawal-amount';

export const useCreateWithdrawal = (): MutationQueryResponse<CreateWithdrawalBody, WithdrawalResponse> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<WithdrawalResponse, CreateWithdrawalBody>('collateral_withdraw', createWithdrawal, {
    onSuccess: async (_data, body) => {
      queryClient.invalidateQueries(getMaxWithdrawalAmountQueryKey(body.assetId));
    },
  });
};
