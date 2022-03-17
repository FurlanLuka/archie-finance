import { API_URL } from 'apps/archie-auth/src/constants';
import axios, { AxiosResponse } from 'axios';

export interface VerifyMfaResponse {
  redirectUrl: string;
}

export const verifyMfa = async (
  sessionToken: string,
  totp: string,
  state: string,
): Promise<VerifyMfaResponse> => {
  const response: AxiosResponse<VerifyMfaResponse> = await axios.post(
    `${API_URL}/v1/mfa/verification/verify/${sessionToken}`,
    {
      totp,
      state,
    },
  );

  return response.data;
};
