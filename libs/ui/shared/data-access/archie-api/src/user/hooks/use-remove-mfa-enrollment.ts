import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  removeMfaEnrollment,
  RemoveMfaEnrollmentBody,
} from '../api/remove-mfa-enrollment';

export const MFA_ENROLLMENT_QUERY_KEY = 'mfa_enrollment';

export const useRemoveMfaEnrollment = (): MutationQueryResponse<
  void,
  RemoveMfaEnrollmentBody
> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<void, RemoveMfaEnrollmentBody>(
    'remove_mfa_enrollment',
    removeMfaEnrollment,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MFA_ENROLLMENT_QUERY_KEY);
      },
    },
  );
};
