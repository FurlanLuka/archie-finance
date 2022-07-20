import * as yup from 'yup';

export const WithdrawSchema = yup.object({
  withdrawAmount: yup.number().required('dashboard_withdraw.error.required_field').min(3, 'Some error'), // TBD
  withdrawAddress: yup.string().required('dashboard_withdraw.error.required_field').min(3, 'Some error'), // TBD
});
