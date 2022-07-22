import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createWithdrawal, CreateWithdrawalBody, WithdrawalResponse } from '../api/create-withdrawal';

export const useCreateWithdrawal = (): MutationQueryResponse<CreateWithdrawalBody, WithdrawalResponse> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<WithdrawalResponse, CreateWithdrawalBody>('collateral_withdraw', createWithdrawal, {
    onSuccess: () => {
      console.log('succs to be you');
    },
  });
};
