import * as yup from 'yup';

import { PaymentOption } from './pay-with-paypal-form.interfaces';

export interface PayWithPaypalFormData {
  paymentOption: PaymentOption;
  amount: number;
}

export const getPayWithPaypalFormSchema = (maxAmount: number) =>
  yup.object({
    paymentOption: yup
      .string()
      .oneOf(Object.values(PaymentOption))
      .required('payment_modal.payment_schedule.error.required_field'),
    amount: yup
      .number()
      .typeError('payment_modal.payment_schedule.error.amount_type_error')
      .test('amount_required_test', 'payment_modal.payment_schedule.error.required_field', function (value) {
        if (this.parent.paymentOption === PaymentOption.CUSTOM && !value) {
          return false;
        }

        return true;
      })
      .test('min_amount_test', 'payment_modal.payment_schedule.error.min_amount', function (value) {
        if (this.parent.paymentOption !== PaymentOption.CUSTOM) {
          return true;
        }

        if (!value) {
          return false;
        }

        return value > 0;
      })
      .test('max_amount_test', 'payment_modal.payment_schedule.error.max_amount', function (value) {
        if (this.parent.paymentOption !== PaymentOption.CUSTOM) {
          return true;
        }

        if (!value) {
          return false;
        }

        return value <= maxAmount;
      }),
  });
