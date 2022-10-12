import axios, { AxiosResponse } from 'axios';

import { API_URL } from '@archie-webapps/shared/constants';

interface ConnectionTokenResponse {
  authToken: string;
}

export const getConnectionToken = async (accessToken: string): Promise<ConnectionTokenResponse> => {
  const response: AxiosResponse<ConnectionTokenResponse> = await axios.post(
    `${API_URL}/v1/ws_auth`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};
