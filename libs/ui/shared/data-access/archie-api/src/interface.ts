import { ApiError } from './api-error';

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  requiredScopes?: string[];
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


export enum MutationState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  IDLE = 'IDLE',
}

interface ErrorMutationQueryResponse<T> {
  state: MutationState.ERROR;
  error: ApiError;
  mutate: (payload: Omit<T, 'accessToken'>) => void;
}

interface SuccessMutationQueryResponse<T = any, P = any> {
  state: MutationState.SUCCESS;
  data: T;
  mutate: (payload: Omit<P, 'accessToken'>) => void;
}

interface IdleMutationQueryResponse<T = any> {
  state: MutationState.IDLE;
  mutate: (payload: Omit<T, 'accessToken'>) => void;
}

interface LoadingMutationQueryResponse {
  state: MutationState.LOADING;
}

export type MutationQueryResponse<Response = any, Payload = any> =
  | LoadingMutationQueryResponse
  | ErrorMutationQueryResponse<Payload>
  | SuccessMutationQueryResponse<Response, Payload>
  | IdleMutationQueryResponse<Payload>;
