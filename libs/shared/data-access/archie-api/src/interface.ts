import { ApiError } from './api-error';

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export enum RequestState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  IDLE = 'IDLE',
  LOADING_NEXT_PAGE = 'LOADING_NEXT_PAGE',
  ERROR_NEXT_PAGE = 'ERROR_NEXT_PAGE',
}

interface LoadingQueryResponse {
  state: RequestState.LOADING;
}

interface ErrorQueryResponse {
  state: RequestState.ERROR;
  error: ApiError;
}

interface SuccessQueryResponse<T = any> {
  state: RequestState.SUCCESS;
  data: T;
}

interface IdleQueryResponse {
  state: RequestState.IDLE;
  fetch: () => void;
}

export type QueryResponse<T> = LoadingQueryResponse | ErrorQueryResponse | SuccessQueryResponse<T> | IdleQueryResponse;

interface LoadingMutationQueryResponse {
  state: RequestState.LOADING;
}

interface ErrorMutationQueryResponse {
  state: RequestState.ERROR;
  error: ApiError;
}

interface SuccessMutationQueryResponse<T = any> {
  state: RequestState.SUCCESS;
  data: T;
}

interface IdleMutationQueryResponse<T = any> {
  state: RequestState.IDLE;
  mutate: (payload: Omit<T, 'accessToken'>) => void;
}

export type MutationQueryResponse<Payload = any, Response = any> =
  | LoadingMutationQueryResponse
  | ErrorMutationQueryResponse
  | SuccessMutationQueryResponse<Response>
  | IdleMutationQueryResponse<Payload>;

interface SuccessInfiniteQueryResponse<T> {
  state: RequestState.SUCCESS;
  pages: T[];
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
}

interface LoadingNextPageResponse<T> {
  state: RequestState.LOADING_NEXT_PAGE;
  pages: T[];
}

interface ErrorNextPageResponse<T> {
  state: RequestState.ERROR_NEXT_PAGE;
  pages: T[];
}

export type InfiniteQueryResponse<T> =
  | LoadingQueryResponse
  | ErrorQueryResponse
  | SuccessInfiniteQueryResponse<T>
  | IdleQueryResponse
  | LoadingNextPageResponse<T>
  | ErrorNextPageResponse<T>;

export interface PaginationParams {
  page: number;
}

export interface PaginationMeta {
  totalCount: number;
  count: number;
  page: number;
  limit: number;
}
