import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { removeMfaEnrollment } from '../api/remove-mfa-enrollment';

export const MFA_ENROLLMENT_QUERY_KEY = 'mfa_enrollment';

export const useRemoveMfaEnrollment = (enrollmentId: string): MutationQueryResponse<void, void> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<void, DefaultVariables>(
    'remove_mfa_enrollment',
    async ({ accessToken }) => {
      return removeMfaEnrollment(accessToken, enrollmentId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MFA_ENROLLMENT_QUERY_KEY);
      },
    },
  );
};