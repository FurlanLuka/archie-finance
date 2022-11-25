import { Options } from 'k6/options';
import { LOAD_OPTIONS } from '../config';

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
