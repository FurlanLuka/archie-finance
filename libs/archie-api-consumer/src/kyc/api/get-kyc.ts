import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface GetKycResponse {
  fullLegalName: string;
  dateOfBirth: string;
  location: string;
  ssnDigits: number;
}

export const ERROR_LIST = new Map([
  [
    'KYC_NOT_FOUND',
    'KYC record not found. Please submit your KYC or contact support.',
  ],
]);

export const getKyc = async (accessToken: string): Promise<GetKycResponse> => {
  return getRequest<GetKycResponse>(
    `${API_URL}/v1/kyc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
