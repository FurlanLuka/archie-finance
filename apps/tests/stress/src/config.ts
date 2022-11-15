import { Options } from 'k6/options';

export const QUEUE_URL: string | undefined = __ENV.QUEUE_URL;
export const API_BASE_URL: string | undefined = __ENV.API_BASE_URL;
export const LOAD_OPTIONS: Options =
  <string | undefined>__ENV.LOAD_OPTIONS !== undefined
    ? JSON.parse(__ENV.LOAD_OPTIONS)
    : {};
export const AUTH_BASE_URL: string | undefined = __ENV.AUTH_BASE_URL;

export const CREDIT_LINE_BASE_URL: string | undefined =
  __ENV.CREDIT_LINE_BASE_URL;
