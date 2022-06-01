import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface CreateKycPayload extends DefaultVariables {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  ssnDigits: number;
}

export type CreateKycResponse = CreateKycPayload;

export const ERROR_LIST = new Map([
  [
    'ERR_CREATING_KYC_RECORD',
    'There was an issue creating kyc record. Please try again or contact support.',
  ],
  [
    'KYC_ALREADY_SUBMITTED',
    'You have already submitted your KYC. If you made a mistake, please contact support.',
  ],
]);

export const createKyc = async ({
  accessToken,
  ...payload
}: DefaultVariables): Promise<CreateKycResponse> => {
  return postRequest<typeof payload, CreateKycResponse>(
    `${API_URL}/v1/kyc`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
