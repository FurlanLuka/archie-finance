import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { removeAutopay } from '../api/remove-autopay';

import { AUTOPAY_RECORD_QUERY_KEY } from './use-get-autopay';

export const useRemoveAutopay = (): MutationQueryResponse<void> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<void, DefaultVariables>(
    'remove_autopay',
    async ({ accessToken }) => {
      return removeAutopay(accessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(AUTOPAY_RECORD_QUERY_KEY);
      },
    },
  );
};
