import { PlaidLinkToken } from '@archie/api/credit-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  createLinkToken,
  CreatePlaidLinkTokenBody,
} from '../api/create-link-token';

export const useCreateLinkToken = (): MutationQueryResponse<
  PlaidLinkToken,
  CreatePlaidLinkTokenBody
> => {
  return useExtendedMutation<PlaidLinkToken, CreatePlaidLinkTokenBody>(
    'create_link_token',
    createLinkToken,
  );
};
