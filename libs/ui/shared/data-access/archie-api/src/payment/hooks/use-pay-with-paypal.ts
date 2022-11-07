import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { payWithPaypal, PayWithPaypalPayload, PayWithPaypalResponse } from '../api/pay-with-paypal';

export const usePayWithPaypal = (): MutationQueryResponse<PayWithPaypalResponse, PayWithPaypalPayload> => {
  return useExtendedMutation<PayWithPaypalResponse, PayWithPaypalPayload>('paypal_record', payWithPaypal, {
    onSuccess: (data) => {
      window.location.href = data.paymentUrl;
    },
  });
};
