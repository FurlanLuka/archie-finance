import { useQueryClient } from 'react-query';

import { WithdrawResponse } from '@archie/api/ledger-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  createWithdrawal,
  CreateWithdrawalBody,
} from '../api/create-withdrawal';

import { getMaxWithdrawalAmountQueryKey } from './use-get-max-withdrawal-amount';

export const useCreateWithdrawal = (): MutationQueryResponse<
  WithdrawResponse,
  CreateWithdrawalBody
> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<WithdrawResponse, CreateWithdrawalBody>(
    'collateral_withdraw',
    createWithdrawal,
    {
      onSuccess: async (_data, body) => {
        queryClient.invalidateQueries(
          getMaxWithdrawalAmountQueryKey(body.assetId),
        );
      },
    },
  );
};
