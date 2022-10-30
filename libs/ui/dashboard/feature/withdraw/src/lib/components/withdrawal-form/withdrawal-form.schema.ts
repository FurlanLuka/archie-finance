import { BigNumber } from 'bignumber.js';
import * as yup from 'yup';

export const getWithdrawSchema = (maxAmount: BigNumber) =>
  yup.object({
    withdrawAmount: yup
      .string()
      .typeError('dashboard_withdraw.form.amount_type_error')
      .required('dashboard_withdraw.form.required_field_error')
      .test(
        'min',
        'dashboard_withdraw.form.amount_min_error',
        (val: string | undefined) =>
          val === undefined ? false : BigNumber(val).isGreaterThan(0),
      )
      .test(
        'max',
        'dashboard_withdraw.form.amount_max_error',
        (val: string | undefined) =>
          val === undefined
            ? false
            : BigNumber(val).isLessThanOrEqualTo(maxAmount),
      ),
    withdrawAddress: yup
      .string()
      .required('dashboard_withdraw.form.required_field_error'),
  });
