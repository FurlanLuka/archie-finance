import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { MutationFunction, QueryFunction, QueryKey } from 'react-query';

import { SessionState } from '@archie-webapps/shared/data-access/session';

import { ApiError, UnauthenticatedApiError } from './api-error';
import { ApiErrorResponse } from './interface';

export const mapErrorResponse = (apiErrorResponse: ApiErrorResponse, errorList: Map<string, string>): ApiError => {
  if (apiErrorResponse.statusCode === 401) {
    return new UnauthenticatedApiError();
  }

  const errorName: string = apiErrorResponse.message;

  const errorMessage: string | undefined = errorList.get(errorName);

  if (errorMessage === undefined) {
    if (apiErrorResponse.error === undefined) {
      return new ApiError('Unexpected error, please contact support.');
    }

    return new ApiError('apiErrorResponse.error');
  }

  return new ApiError(errorMessage);
};

export const getRequest = async <Response = any>(
  endpoint: string,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.get(endpoint, requestConfig);

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse((errorObject.response as AxiosResponse<ApiErrorResponse>).data, errorList);
  }
};

export const deleteRequest = async <Response = any>(
  endpoint: string,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.delete(endpoint, requestConfig);

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse((errorObject.response as AxiosResponse<ApiErrorResponse>).data, errorList);
  }
};

export const postRequest = async <Payload = any, Response = any>(
  endpoint: string,
  payload: Payload,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.post(endpoint, payload, requestConfig);

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse((errorObject.response as AxiosResponse<ApiErrorResponse>).data, errorList);
  }
};

export const sessionRefreshWrapper = <TQueryFnData>(
  queryFn: (accessToken: string) => Promise<TQueryFnData>,
  accessToken: string,
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>,
  getAccessTokenSilently: () => Promise<string>,
): QueryFunction<TQueryFnData, QueryKey> => {
  const wrapper = async (): Promise<TQueryFnData> => {
    try {
      return await queryFn(accessToken);
    } catch (error) {
      if (error instanceof UnauthenticatedApiError) {
        try {
          const accessToken = await getAccessTokenSilently();
          setAccessToken(accessToken);

          return queryFn(accessToken);
        } catch (error) {
          setSessionState(SessionState.NOT_AUTHENTICATED);
          throw new Error('TOKEN_REFRESH_FAILED');
        }
      }

      throw error;
    }
  };

  return wrapper;
};

export interface DefaultVariables {
  accessToken: string;
  [key: string]: unknown;
}

export const sessionRefreshWrapperMutation = <TData, TVariables extends DefaultVariables>(
  mutationFn: MutationFunction<TData, DefaultVariables>,
  accessToken: string,
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>,
  getAccessTokenSilently: () => Promise<string>,
): MutationFunction<TData, Omit<TVariables, 'accessToken'>> => {
  const wrapper = async (payload: Omit<TVariables, 'accessToken'>): Promise<TData> => {
    try {
      return await mutationFn({
        ...payload,
        accessToken: accessToken,
      });
    } catch (error) {
      if (error instanceof UnauthenticatedApiError) {
        try {
          const accessToken = await getAccessTokenSilently();

          setAccessToken(accessToken);

          return mutationFn({
            ...payload,
            accessToken: accessToken,
          });
        } catch (error) {
          setSessionState(SessionState.NOT_AUTHENTICATED);
          throw new Error('TOKEN_REFRESH_FAILED');
        }
      }

      throw error;
    }
  };

  return wrapper;
};
