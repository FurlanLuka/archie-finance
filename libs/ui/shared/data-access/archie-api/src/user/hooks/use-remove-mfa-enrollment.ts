import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  removeMfaEnrollment,
  RemoveMfaEnrollmentBody,
} from '../api/remove-mfa-enrollment';

export const useRemoveMfaEnrollment = (): MutationQueryResponse<
  void,
  RemoveMfaEnrollmentBody
> => {
  return useExtendedMutation<void, RemoveMfaEnrollmentBody>(
    ['remove_mfa_enrollment'],
    removeMfaEnrollment,
  );
};
