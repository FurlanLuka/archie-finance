import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createWithdrawal, CreateWithdrawalBody, WithdrawalResponse } from '../api/create-withdrawal';

import { LEDGER_QUERY_KEY } from './use-get-ledger';

export const useCreateWithdrawal = (): MutationQueryResponse<CreateWithdrawalBody, WithdrawalResponse> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<WithdrawalResponse, CreateWithdrawalBody>('collateral_withdraw', createWithdrawal, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([LEDGER_QUERY_KEY]);
    },
  });
};
