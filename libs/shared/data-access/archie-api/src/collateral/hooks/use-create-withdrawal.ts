import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createWithdrawal, CreateWithdrawalBody, WithdrawalResponse } from '../api/create-withdrawal';

import { COLLATERAL_VALUE_RECORD_QUERY_KEY } from './use-poll-collateral-value';

export const useCreateWithdrawal = (): MutationQueryResponse<CreateWithdrawalBody, WithdrawalResponse> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<WithdrawalResponse, CreateWithdrawalBody>('collateral_withdraw', createWithdrawal, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([COLLATERAL_VALUE_RECORD_QUERY_KEY]);
    },
  });
};
