import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { createRizeUser } from '../api/create-rize-user';

export const useCreateRizeUser = (): MutationQueryResponse => {
  return useExtendedMutation<unknown, DefaultVariables>('rize_user_create', createRizeUser);
};
