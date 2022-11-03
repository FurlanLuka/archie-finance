import { Options } from 'k6/options';

export function getOptions(): Options {
  const defaultOptions: Options = {
    vus: 1,
    duration: '5s',
    userAgent: 'k6-stress-test',
  };

  return __ENV.LOAD_OPTIONS !== undefined
    ? {
        ...defaultOptions,
        ...JSON.parse(__ENV.LOAD_OPTIONS),
      }
    : defaultOptions;
}

export function getApiBaseUrl(): string {
  const apibaseurl: string | undefined = __ENV.API_BASE_URL;

  if (apibaseurl === undefined) {
    throw new Error('API_BASE_URL_ENV_VARIABLE_MISSING');
  }

  return apibaseurl;
}
