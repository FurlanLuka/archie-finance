import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface PayWithPaypalParams {
  paymentAmount: number;
}

export interface PayWithPaypalParamsBody extends DefaultVariables, PayWithPaypalParams {}

export const ERROR_LIST = new Map<string, string>([]);

export const payWithPaypal = async ({ accessToken, ...body }: PayWithPaypalParamsBody): Promise<void> => {
  return postRequest(
    `${API_URL}/v1/paypal/orders`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
