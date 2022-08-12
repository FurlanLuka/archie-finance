import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface KycResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  ssnDigits: number;
  createdAt: string;
}

export const ERROR_LIST = new Map([
  ['KYC_NOT_FOUND', 'KYC record not found. Please submit your KYC or contact support.'],
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
