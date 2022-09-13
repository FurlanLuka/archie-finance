import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { payWithPaypal, PayWithPaypalPayload, PayWithPaypalResponse } from '../api/pay-with-paypal';

export const usePayWithPaypal = (): MutationQueryResponse<PayWithPaypalPayload, PayWithPaypalResponse> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<PayWithPaypalResponse, PayWithPaypalPayload>('paypal_record', payWithPaypal, {
    onSuccess: data => {
      console.log(data.paymentUrl);

      // queryClient.setQueryData('paypal_response', data);
    }
  });
};
