import * as yup from 'yup';

export const WithdrawSchema = yup.object({
  withdrawAmount: yup.string().required().length(3, 'Some error'),
});
