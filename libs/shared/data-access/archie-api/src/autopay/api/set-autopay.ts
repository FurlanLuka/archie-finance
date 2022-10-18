import { API_URL } from '@archie-webapps/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface SetAutopayBody extends DefaultVariables {
  paymentInstrumentId: string;
  agreementDocumentId: string;
}

interface SetAutopayAPIBody {
  amountType: string;
  paymentInstrumentId: string;
  isAlignedToDueDates: boolean;
  agreementDocumentId: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const setAutopay = async ({
  accessToken,
  paymentInstrumentId,
  agreementDocumentId,
}: SetAutopayBody): Promise<void> => {
  return postRequest<SetAutopayAPIBody, void>(
    `${API_URL}/v1/loan_autopay`,
    {
      paymentInstrumentId,
      agreementDocumentId,
      amountType: 'statementMinimumAmount',
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
