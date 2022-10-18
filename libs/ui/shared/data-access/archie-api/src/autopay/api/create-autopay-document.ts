import { API_URL } from '@archie-microservices/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

interface CreateAutopayDocumentPayload {
  paymentInstrumentId: string;
}
export type CreateAutopayDocumentBody = DefaultVariables &
  CreateAutopayDocumentPayload;

export interface CreateAutopayDocumentResponse {
  id: string;
  document: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const createAutopayDocument = async ({
  accessToken,
  paymentInstrumentId,
}: CreateAutopayDocumentBody): Promise<CreateAutopayDocumentResponse> => {
  return postRequest<
    CreateAutopayDocumentPayload,
    CreateAutopayDocumentResponse
  >(
    `${API_URL}/v1/loan_autopay/documents`,
    { paymentInstrumentId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
