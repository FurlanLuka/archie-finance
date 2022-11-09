import { AutopayAgreement } from '@archie/api/peach-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  createAutopayDocument,
  CreateAutopayDocumentBody,
} from '../api/create-autopay-document';

export const useCreateAutopayDocument = (): MutationQueryResponse<
  CreateAutopayDocumentBody,
  AutopayAgreement
> => {
  return useExtendedMutation<AutopayAgreement, CreateAutopayDocumentBody>(
    'create_autopay_document',
    createAutopayDocument,
  );
};
