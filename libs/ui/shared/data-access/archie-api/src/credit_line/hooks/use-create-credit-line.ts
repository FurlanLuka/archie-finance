import { CreditLine } from '@archie/api/credit-line-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { createCreditLine } from '../api/create-credit-line';

export const useCreateCreditLine = (): MutationQueryResponse<
  CreditLine,
  DefaultVariables
> => {
  return useExtendedMutation<CreditLine, DefaultVariables>(
    ['credit_line'],
    createCreditLine,
  );
};
