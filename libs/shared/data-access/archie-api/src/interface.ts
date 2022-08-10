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
