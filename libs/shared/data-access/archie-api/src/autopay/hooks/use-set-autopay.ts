import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { setAutopay, SetAutopayBody } from '../api/set-autopay';

export const useSetAutopay = (): MutationQueryResponse<SetAutopayBody, void> => {
  return useExtendedMutation<void, SetAutopayBody>('set_autopay', setAutopay);
};
