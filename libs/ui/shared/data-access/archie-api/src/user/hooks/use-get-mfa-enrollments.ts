import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getMfaEnrollments, MfaEnrollment } from '../api/get-mfa-enrollments';

export const MFA_ENROLLMENTS_RECORD_QUERY_KEY = 'mfa_enrollments_record';

export const useGetMfaEnrollments = (): QueryResponse<MfaEnrollment[]> => 
  useExtendedQuery(MFA_ENROLLMENTS_RECORD_QUERY_KEY, async (accessToken: string) =>
    getMfaEnrollments(accessToken),
  );
