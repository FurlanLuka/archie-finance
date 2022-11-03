import { httpPost } from './http';

export function getAccessToken(userId: string): string {
  const authBaseUrl: string | undefined = __ENV.AUTH_BASE_URL;

  if (authBaseUrl === undefined) {
    throw new Error('AUTH_BASE_URL_ENV_VARIABLE_MISSING');
  }

  return httpPost({
    uri: 'http://localhost:91/internal/test/authorization',
    body: {
      userId,
    },
  }).body;
}
