import { AmountType, CreateAutopay } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface SetAutopayBody
  extends DefaultVariables,
    Pick<CreateAutopay, 'paymentInstrumentId' | 'agreementDocumentId'> {}

export const ERROR_LIST = new Map<string, string>([]);

export const setAutopay = async ({
  accessToken,
  paymentInstrumentId,
  agreementDocumentId,
}: SetAutopayBody): Promise<void> => {
  return postRequest<CreateAutopay, void>(
    `${API_URL}/v1/loan_autopay`,
    {
      paymentInstrumentId,
      agreementDocumentId,
      amountType: AmountType.statementMinimumAmount,
      isAlignedToDueDates: true,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
