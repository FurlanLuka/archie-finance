import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { startAptoVerification } from '../api/start-apto-verification';

export const useStartAptoVerification = (): MutationQueryResponse<
  unknown,
  DefaultVariables
> => {
  return useExtendedMutation<unknown, DefaultVariables>(
    ['apto_verification_start'],
    startAptoVerification,
  );
};
