import { Options } from 'k6/options';

export function getOptions(): Options {
  const defaultOptions: Options = {
    vus: 10,
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
