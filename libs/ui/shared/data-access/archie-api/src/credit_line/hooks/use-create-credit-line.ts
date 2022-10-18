import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createCreditLine } from '../api/create-credit-line';

export const useCreateCreditLine = (): MutationQueryResponse => {
  return useExtendedMutation('credit_line', createCreditLine);
};
