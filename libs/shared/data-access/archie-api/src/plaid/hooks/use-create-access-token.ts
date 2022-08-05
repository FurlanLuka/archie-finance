import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createAccessToken, CreateAccessTokenBody } from '../api/create-access-token';

export const useCreateAccessToken = (): MutationQueryResponse<CreateAccessTokenBody> => {
  return useExtendedMutation<void, CreateAccessTokenBody>('create_access_token', createAccessToken, {});
};
