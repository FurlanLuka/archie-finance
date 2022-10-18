import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  createMfaEnrollment,
  CreateMfaEnrollmentResponse,
} from '../api/create-mfa-enrollment';

export const useStartMfaEnrollment = (): MutationQueryResponse<
  unknown,
  CreateMfaEnrollmentResponse
> => {
  return useExtendedMutation('start_mfa_enrollment', createMfaEnrollment);
};
