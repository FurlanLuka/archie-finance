import { useQueryClient } from '@tanstack/react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { setAutopay, SetAutopayBody } from '../api/set-autopay';

import { AUTOPAY_RECORD_QUERY_KEY } from './use-get-autopay';

export const useSetAutopay = (): MutationQueryResponse<
  void,
  SetAutopayBody
> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<void, SetAutopayBody>(
    ['set_autopay'],
    setAutopay,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(AUTOPAY_RECORD_QUERY_KEY);
      },
    },
  );
};
