import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  createAutopayDocument,
  CreateAutopayDocumentBody,
  CreateAutopayDocumentResponse,
} from '../api/create-autopay-document';

export const useCreateAutopayDocument = (): MutationQueryResponse<
  CreateAutopayDocumentBody,
  CreateAutopayDocumentResponse
> => {
  return useExtendedMutation<CreateAutopayDocumentResponse, CreateAutopayDocumentBody>(
    'create_autopay_document',
    createAutopayDocument,
  );
};
