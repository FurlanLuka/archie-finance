import { Enrollment } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getMfaEnrollments } from '../api/get-mfa-enrollments';

export const MFA_ENROLLMENTS_RECORD_QUERY_KEY = ['mfa_enrollments_record'];

export const useGetMfaEnrollments = (): QueryResponse<Enrollment[]> =>
  useExtendedQuery(
    MFA_ENROLLMENTS_RECORD_QUERY_KEY,
    async (accessToken: string) => getMfaEnrollments(accessToken),
  );
