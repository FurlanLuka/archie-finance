import { AutopayAgreement, CreateAutopayDocument } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export type CreateAutopayDocumentBody = DefaultVariables & CreateAutopayDocument;

export const ERROR_LIST = new Map<string, string>([]);

export const createAutopayDocument = async ({
  accessToken,
  paymentInstrumentId,
}: CreateAutopayDocumentBody): Promise<AutopayAgreement> => {
  return postRequest<CreateAutopayDocument, AutopayAgreement>(
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
