import { useAuth0 } from '@auth0/auth0-react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import {
  MutationFunction,
  MutationKey,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';

import {
  SessionState,
  useAuthenticatedSession,
} from '@archie/ui/shared/data-access/session';

import { ApiError, ApiErrors, UnauthenticatedApiError } from './api-error';
import {
  DefaultVariables,
  sessionRefreshWrapper,
  sessionRefreshWrapperMutation,
} from './helpers';
import {
  InfiniteQueryResponse,
  MutationQueryResponse,
  PaginationParams,
  QueryResponse,
  RequestState,
} from './interface';

export const useExtendedQuery = <TQueryFnData>(
  queryKey: string,
  queryFn: (accessToken: string) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, ApiErrors, TQueryFnData, QueryKey>,
    'queryKey' | 'queryFn'
  >,
): QueryResponse<TQueryFnData> => {
  const { setAccessToken, setSessionState, accessToken } =
    useAuthenticatedSession();

  const { getAccessTokenSilently } = useAuth0();

  const request = useQuery<TQueryFnData, ApiErrors>(
    queryKey,
    sessionRefreshWrapper(
      queryFn,
      accessToken,
      setAccessToken,
      setSessionState,
      getAccessTokenSilently,
    ),
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
    fetch: request.refetch,
  };
};

export const useExtendedInfiniteQuery = <TQueryFnData>(
  queryKey: string,
  getNextPage: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => number | undefined,
  queryFn: (
    accessToken: string,
    paginationParams: PaginationParams,
  ) => Promise<TQueryFnData>,
  options?: Omit<
    UseInfiniteQueryOptions<
      TQueryFnData,
      ApiErrors,
      TQueryFnData,
      TQueryFnData,
      QueryKey
    >,
    'queryKey' | 'queryFn'
  >,
): InfiniteQueryResponse<TQueryFnData> => {
  const [isFetchingNextPageError, setIsFetchingNextPageError] = useState(false);
  const { setAccessToken, setSessionState, accessToken } =
    useAuthenticatedSession();

  const { getAccessTokenSilently } = useAuth0();

  const request = useInfiniteQuery<TQueryFnData, ApiErrors>(
    queryKey,
    // TODO check why the line below throws error if we try to use sessionRefreshInfiniteWrapper
    async ({ pageParam = 0 }) => {
      const paginationParams = { page: pageParam };

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

        throw error;
      }
    },
    {
      ...options,
      getNextPageParam: getNextPage,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 15,
      staleTime: 1000 * 60 * 15,
    },
  );

  const fetchNextPage = async (): Promise<void> => {
    try {
      await request.fetchNextPage();
    } catch (error) {
      setIsFetchingNextPageError(true);
    }
  };

  const fetch = async (): Promise<void> => {
    await request.refetch();
  };

  if (isFetchingNextPageError) {
    return {
      state: RequestState.ERROR_NEXT_PAGE,
      pages: request.data?.pages ?? [],
    };
  }

  if (request.status === 'error') {
    return {
      state: RequestState.ERROR,
      error: request.error,
    };
  }

  if (request.isFetchingNextPage) {
    return {
      state: RequestState.LOADING_NEXT_PAGE,
      pages: request.data?.pages ?? [],
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
      pages: request.data.pages,
      hasNextPage: request.hasNextPage ?? false,
      fetchNextPage,
    };
  }

  return {
    state: RequestState.IDLE,
    fetch,
  };
};

export const useExtendedMutation = <TData, TVariables extends DefaultVariables>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, ApiErrors, TVariables, unknown>,
    'mutationKey' | 'mutationFn'
  >,
): MutationQueryResponse<Omit<TVariables, 'accessToken'>, TData> => {
  const { setAccessToken, setSessionState, accessToken } =
    useAuthenticatedSession();

  const { getAccessTokenSilently } = useAuth0();

  const request = useMutation<TData, ApiError, TVariables>(
    mutationKey,
    sessionRefreshWrapperMutation<TData, TVariables>(
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
      mutate: request.mutate,
    } as MutationQueryResponse<Omit<TVariables, 'accessToken'>, TData>;
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
