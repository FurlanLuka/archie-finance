import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { startAptoVerification } from '../api/start-apto-verification';

export const useStartAptoVerification = (): MutationQueryResponse => {
  return useExtendedMutation<unknown, DefaultVariables>('apto_verification_start', startAptoVerification);
};
