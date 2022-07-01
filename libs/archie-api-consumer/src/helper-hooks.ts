import { useAuth0 } from '@auth0/auth0-react';
import {
  MutationFunction,
  MutationKey,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';

import { useAuthenticatedSession } from '@archie-webapps/shared/data-access-session';

import { ApiErrors } from './api-error';
import { DefaultVariables, sessionRefreshWrapper, sessionRefreshWrapperMutation } from './helpers';
import { MutationQueryResponse, QueryResponse, RequestState } from './interface';

export const useExtendedQuery = <TQueryFnData>(
  queryKey: string,
  queryFn: (accessToken: string) => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, ApiErrors, TQueryFnData, QueryKey>, 'queryKey' | 'queryFn'>,
): QueryResponse<TQueryFnData> => {
  const { setAccessToken, setSessionState, accessToken } = useAuthenticatedSession();

  const { getAccessTokenSilently } = useAuth0();

  const request = useQuery<TQueryFnData, ApiErrors>(
    queryKey,
    sessionRefreshWrapper(queryFn, accessToken, setAccessToken, setSessionState, getAccessTokenSilently),
    {
      ...options,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 15,
      staleTime: 1000 * 60 * 15,
    },
  );

  if (request.status === 'error') {
    return {
      state: RequestState.ERROR,
      error: request.error,
    };
  }

  if (request.status === 'loading') {
    return {
      state: RequestState.LOADING,
    };
  }

  if (request.status === 'success') {
    return {
      state: RequestState.SUCCESS,
      data: request.data,
    };
  }

  return {
    state: RequestState.IDLE,
  };
};

export const useExtendedMutation = <TData, TVariables extends DefaultVariables>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, DefaultVariables>,
  options?: Omit<UseMutationOptions<TData, ApiErrors, TVariables, unknown>, 'mutationKey' | 'mutationFn'>,
): MutationQueryResponse<Omit<TVariables, 'accessToken'>, TData> => {
  const { setAccessToken, setSessionState, accessToken } = useAuthenticatedSession();

  const { getAccessTokenSilently } = useAuth0();

  const request = useMutation(
    mutationKey,
    sessionRefreshWrapperMutation<TData, DefaultVariables>(
      mutationFn,
      accessToken,
      setAccessToken,
      setSessionState,
      getAccessTokenSilently,
    ),
    options,
  );

  if (request.status === 'error') {
    return {
      state: RequestState.ERROR,
      error: request.error,
    };
  }

  if (request.status === 'loading') {
    return {
      state: RequestState.LOADING,
    };
  }

  if (request.status === 'success') {
    return {
      state: RequestState.SUCCESS,
      data: request.data,
    };
  }

  return {
    state: RequestState.IDLE,
    mutate: request.mutate,
  } as MutationQueryResponse<Omit<TVariables, 'accessToken'>, TData>;
};
