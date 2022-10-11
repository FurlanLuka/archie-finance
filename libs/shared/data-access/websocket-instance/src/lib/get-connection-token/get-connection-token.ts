import axios, { AxiosResponse } from 'axios';

import { API_URL } from '@archie-webapps/shared/constants';

interface ConnectionTokenResponse {
  accessToken: string;
}

export const getConnectionToken = async (apiToken: string): Promise<ConnectionTokenResponse> => {
  const response: AxiosResponse<ConnectionTokenResponse> = await axios.post(
    `${API_URL}/v1/user/email-verification/resend`,
    {},
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  );

  return response.data;
};
