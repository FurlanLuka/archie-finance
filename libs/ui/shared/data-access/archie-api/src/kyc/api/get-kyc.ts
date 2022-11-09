import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map([
  [
    'KYC_NOT_FOUND',
    'KYC record not found. Please submit your KYC or contact support.',
  ],
]);

export const getKyc = async (accessToken: string): Promise<KycResponse> => {
  return getRequest<KycResponse>(
    `${API_URL}/v1/kyc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
