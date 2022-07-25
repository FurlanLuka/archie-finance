import * as yup from 'yup';

export const getWithdrawSchema = (maxAmount: number) =>
  yup.object({
    withdrawAmount: yup
      .number()
      .typeError('dashboard_withdraw.form.amount_type_error')
      .required('dashboard_withdraw.form.required_field_error')
      .min(0, 'dashboard_withdraw.form.amount_max_error')
      .max(maxAmount, 'dashboard_withdraw.form.amount_max_error'),
    withdrawAddress: yup.string().required('dashboard_withdraw.form.required_field_error'),
  });
