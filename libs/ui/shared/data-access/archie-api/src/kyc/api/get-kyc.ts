import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface Kyc {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  aptUnit: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  ssnDigits: number;
  income: number;
  createdAt: string;
}

export const ERROR_LIST = new Map([
  [
    'KYC_NOT_FOUND',
    'KYC record not found. Please submit your KYC or contact support.',
  ],
]);

export const getKyc = async (accessToken: string): Promise<Kyc> => {
  return getRequest<Kyc>(
    `${API_URL}/v1/kyc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
