import http, { RefinedResponse, RequestBody, ResponseType } from 'k6/http';

interface RequestOptions {
  uri: string;
  accessToken?: string;
  body?: RequestBody;
}

export function httpGet(request: RequestOptions): RefinedResponse<'text'> {
  return http.get(request.uri, {
    headers: {
      Authorization: `Bearer ${request.accessToken}`,
    },
  });
}

export function httpPost(request: RequestOptions): RefinedResponse<'text'> {
  return http.post(request.uri, request.body, {
    headers: {
      Authorization: `Bearer ${request.accessToken}`,
    },
  });
}
