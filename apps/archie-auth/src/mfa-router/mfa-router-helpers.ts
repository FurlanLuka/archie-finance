import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../constants';

interface QueryParameters {
  sessionToken: string;
  state: string;
}

export const extractQueryParameters = (): QueryParameters => {
  const queryParameters: URLSearchParams = new URLSearchParams(
    window.location.search,
  );

  const sessionToken: string | null = queryParameters.get('session_token');
  const state: string | null = queryParameters.get('state');

  if (sessionToken === null || state === null) {
    throw new Error('Invalid request');
  }

  return {
    sessionToken: queryParameters.get('session_token') as string,
    state: 'state',
  };
};

export interface MfaRecord {
  id: string;
  userId?: string;
  totpSecret?: string;
}

export const getMfaRecord = async (
  sessionToken: string,
): Promise<MfaRecord> => {
  const response: AxiosResponse<MfaRecord> = await axios.get(
    `${API_URL}/v1/mfa/${sessionToken}`,
  );

  return response.data;
};