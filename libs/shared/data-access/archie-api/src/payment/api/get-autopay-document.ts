import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface GetAutopayDocumentBody extends DefaultVariables {
  paymentInstrumentId: string;
}
export interface GetAutopayDocumentResponse {
  id: string;
  document: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getAutoPayDocument = async ({
  accessToken,
  pa,
}: GetAutopayDocumentBody): Promise<CreatePlaidLinkTokenResponse> => {
  return postRequest<Record<string, never>, CreatePlaidLinkTokenResponse>(
    `${API_URL}/v1/plaid/link_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
