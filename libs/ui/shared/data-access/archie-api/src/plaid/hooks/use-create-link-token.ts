import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  createLinkToken,
  CreatePlaidLinkTokenBody,
  CreatePlaidLinkTokenResponse,
} from '../api/create-link-token';

export const useCreateLinkToken = (): MutationQueryResponse<
  CreatePlaidLinkTokenBody,
  CreatePlaidLinkTokenResponse
> => {
  return useExtendedMutation<
    CreatePlaidLinkTokenResponse,
    CreatePlaidLinkTokenBody
  >('create_link_token', createLinkToken);
};
