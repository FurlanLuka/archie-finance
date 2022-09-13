import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { payWithPaypal, PayWithPaypalPayload } from '../api/pay-with-paypal';

export const usePayWithPaypal = (): MutationQueryResponse<PayWithPaypalPayload, void> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<void, PayWithPaypalPayload>('paypal_record', payWithPaypal, {
    onSuccess: data => {
      console.log(data)
      queryClient.setQueryData('paypal_response', data);
    }
  });
};
