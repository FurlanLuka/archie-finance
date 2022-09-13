import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { PayWithPaypalParamsBody, payWithPaypal } from '../api/pay-with-paypal';

export const usePayWithPaypal = (): MutationQueryResponse<PayWithPaypalParamsBody, void> => {
  return useExtendedMutation<void, PayWithPaypalParamsBody>('paypal_record', payWithPaypal);
};
