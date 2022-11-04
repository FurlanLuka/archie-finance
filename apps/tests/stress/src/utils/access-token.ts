import { httpPost } from './http';
import { AUTH_BASE_URL } from '../config';

export function createAccessToken(userId: string): string {
  if (AUTH_BASE_URL === undefined) {
    throw new Error('AUTH_BASE_URL_ENV_VARIABLE_MISSING');
  }

  return httpPost({
    uri: `${AUTH_BASE_URL}/internal/test/authorization`,
    body: {
      userId,
    },
  }).body;
}
