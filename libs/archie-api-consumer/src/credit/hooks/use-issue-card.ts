import { MutationQueryResponse } from '../../interface';
import { issueCard } from '../api/issue-card';
import { useExtendedMutation } from '@archie/api-consumer/helper-hooks';
import { useQueryClient } from 'react-query';
import { ONBOARDING_RECORD_QUERY_KEY } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { DefaultVariables } from '@archie/api-consumer/helpers';

export const useIssueCard = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, DefaultVariables>('apto_card_issue', issueCard, {
    onSuccess: () => {
      console.log('apto card issue creation successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
