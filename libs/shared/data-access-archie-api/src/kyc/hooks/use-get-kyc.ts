import { useQuery } from 'react-query';

import { ApiError } from '../../api-error';
import { QueryResponse, RequestState } from '../../interface';
import { getKyc, GetKycResponse } from '../api/get-kyc';

export const useGetKyc = (accessToken: string): QueryResponse<GetKycResponse> => {
  const request = useQuery<GetKycResponse, ApiError>('kyc_record', () => getKyc(accessToken), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

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
