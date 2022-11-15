import { Options } from 'k6/options';
import { API_BASE_URL, LOAD_OPTIONS } from '../config';

export function getOptions(): Options {
  const defaultOptions: Options = {
    vus: 10,
    duration: '1s',
    userAgent: 'k6-stress-test',
    setupTimeout: '20m',
  };

  return {
    ...defaultOptions,
    ...LOAD_OPTIONS,
  };
}

export function getApiBaseUrl(): string {
  if (API_BASE_URL === undefined) {
    throw new Error('API_BASE_URL_ENV_VARIABLE_MISSING');
  }

  return API_BASE_URL;
}
