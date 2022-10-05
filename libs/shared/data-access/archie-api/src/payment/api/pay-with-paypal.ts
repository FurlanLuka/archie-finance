import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface PayWithPaypalPayload extends DefaultVariables {
  paymentAmount: number;
}

export interface PayWithPaypalResponse {
  id: string;
  paymentUrl: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const payWithPaypal = async ({ accessToken, ...payload }: PayWithPaypalPayload): Promise<PayWithPaypalResponse> => {
  return postRequest(
    `${API_URL}/v1/paypal/orders`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
