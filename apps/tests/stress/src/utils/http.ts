import http, { RefinedResponse } from 'k6/http';

interface RequestOptions {
  uri: string;
  token?: string;
  payload?: object;
}

export function httpGet(request: RequestOptions): RefinedResponse<undefined> {
  return http.get<undefined>(request.uri, {
    headers: {
      Authorization: `Bearer ${request.token}`,
    },
  });
}
