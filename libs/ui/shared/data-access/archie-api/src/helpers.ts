import { GetTokenWithPopupOptions } from '@auth0/auth0-react';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { MutationFunction, QueryFunction, QueryKey } from 'react-query';

import { SessionState } from '@archie/ui/shared/data-access/session';

import {
  ApiError,
  ApiErrors,
  UnauthenticatedApiError,
  UnauthorizedApiError,
} from './api-error';
import { ApiErrorResponse, PaginationParams } from './interface';

export const mapErrorResponse = (
  apiErrorResponse: ApiErrorResponse,
  errorList: Map<string, string>,
): ApiErrors => {
  if (apiErrorResponse.statusCode === 401) {
    return new UnauthenticatedApiError();
  }
  if (apiErrorResponse.statusCode === 403) {
    return new UnauthorizedApiError(
      apiErrorResponse.message,
      apiErrorResponse.requiredScopes,
    );
  }

  const errorName: string = apiErrorResponse.message;

  const errorMessage: string | undefined = errorList.get(errorName);

  if (errorMessage === undefined) {
    if (apiErrorResponse.error === undefined) {
      return new ApiError('Unexpected error, please contact support.', 500);
    }

    return new ApiError('apiErrorResponse.error', apiErrorResponse.statusCode);
  }

  return new ApiError(
    apiErrorResponse.message,
    apiErrorResponse.statusCode,
    errorMessage,
  );
};

export const getRequest = async <Response = any>(
  endpoint: string,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.get(
      endpoint,
      requestConfig,
    );

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse(
      (errorObject.response as AxiosResponse<ApiErrorResponse>).data,
      errorList,
    );
  }
};

export const deleteRequest = async <Response = any>(
  endpoint: string,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.delete(
      endpoint,
      requestConfig,
    );

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse(
      (errorObject.response as AxiosResponse<ApiErrorResponse>).data,
      errorList,
    );
  }
};

export const postRequest = async <Payload = any, Response = any>(
  endpoint: string,
  payload: Payload,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.post(
      endpoint,
      payload,
      requestConfig,
    );

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse(
      (errorObject.response as AxiosResponse<ApiErrorResponse>).data,
      errorList,
    );
  }
};

export const sessionRefreshWrapper = <TQueryFnData>(
  queryFn: (accessToken: string) => Promise<TQueryFnData>,
  accessToken: string,
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>,
  getAccessTokenSilently: () => Promise<string>,
  getAccessTokenWithPopup: (
    options: GetTokenWithPopupOptions,
  ) => Promise<string>,
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

      if (error instanceof UnauthorizedApiError) {
        try {
          const accessToken = await getAccessTokenWithPopup({
            scope: error.requiredScopes,
          });

          return queryFn(accessToken);
        } catch (error) {
          throw new Error('TOKEN_WITH_SCOPES_FLOW_FAILED');
        }
      }

      throw error;
    }
  };

  return wrapper;
};

export const sessionRefreshInfiniteWrapper = <TQueryFnData>(
  queryFn: (
    accessToken: string,
    paginationParams: PaginationParams,
  ) => Promise<TQueryFnData>,
  accessToken: string,
  paginationParams: PaginationParams,
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>,
  getAccessTokenSilently: () => Promise<string>,
  getAccessTokenWithPopup: (
    options: GetTokenWithPopupOptions,
  ) => Promise<string>,
): QueryFunction<TQueryFnData, QueryKey> => {
  const wrapper = async (): Promise<TQueryFnData> => {
    try {
      return await queryFn(accessToken, paginationParams);
    } catch (error) {
      if (error instanceof UnauthenticatedApiError) {
        try {
          const accessToken = await getAccessTokenSilently();
          setAccessToken(accessToken);

          return queryFn(accessToken, paginationParams);
        } catch (error) {
          setSessionState(SessionState.NOT_AUTHENTICATED);
          throw new Error('TOKEN_REFRESH_FAILED');
        }
      }

      if (error instanceof UnauthorizedApiError) {
        try {
          const accessToken = await getAccessTokenWithPopup({
            scope: error.requiredScopes,
          });

          return queryFn(accessToken, paginationParams);
        } catch (error) {
          throw new Error('TOKEN_WITH_SCOPES_FLOW_FAILED');
        }
      }

      throw error;
    }
  };

  return wrapper;
};

export interface DefaultVariables {
  accessToken: string;
}

export const sessionRefreshWrapperMutation = <
  TData,
  TVariables extends DefaultVariables,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  accessToken: string,
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>,
  getAccessTokenSilently: () => Promise<string>,
  getAccessTokenWithPopup: (
    options: GetTokenWithPopupOptions,
  ) => Promise<string>,
): MutationFunction<TData, TVariables> => {
  const wrapper = async (payload: TVariables): Promise<TData> => {
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

      if (error instanceof UnauthorizedApiError) {
        try {
          const accessToken = await getAccessTokenWithPopup({
            scope: error.requiredScopes,
          });

          return mutationFn({
            ...payload,
            accessToken: accessToken,
          });
        } catch (error) {
          throw new Error('TOKEN_WITH_SCOPES_FLOW_FAILED');
        }
      }

      throw error;
    }
  };

  return wrapper;
};
