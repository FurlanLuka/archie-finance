import { isValid, isPast, isAfter } from 'date-fns';
import * as yup from 'yup';

import { PaymentOption } from './payment-schedule-form.interfaces';

export interface PaymentScheduleFormData {
  paymentOption: PaymentOption;
  scheduledDate: Date;
  amount: number;
}

export const getPaymentScheduleFormSchema = (
  dueDate: Date,
  maxAmount: number,
) =>
  yup.object({
    paymentOption: yup
      .string()
      .oneOf(Object.values(PaymentOption))
      .required('payment_modal.payment_schedule.error.required_field'),
    scheduledDate: yup
      .date()
      .required('payment_modal.payment_schedule.error.required_field')
      .test(
        'is_date_valid',
        'payment_modal.payment_schedule.error.not_valid_date',
        (value) => {
          if (!value) {
            return false;
          }

          return isValid(value);
        },
      )
      .test(
        'past_date_test',
        'payment_modal.payment_schedule.error.cannot_be_past',
        (value) => {
          if (!value) {
            return false;
          }
          return !isPast(value);
        },
      )
      .test(
        'maximum_days_test',
        'payment_modal.payment_schedule.error.max_date',
        (value) => {
          if (!value) {
            return false;
          }
          return !isAfter(value, dueDate);
        },
      ),
    amount: yup
      .number()
      .typeError('payment_modal.payment_schedule.error.amount_type_error')
      .test(
        'amount_required_test',
        'payment_modal.payment_schedule.error.required_field',
        function (value) {
          if (this.parent.paymentOption === PaymentOption.CUSTOM && !value) {
            return false;
          }

          return true;
        },
      )
      .test(
        'min_amount_test',
        'payment_modal.payment_schedule.error.min_amount',
        function (value) {
          if (this.parent.paymentOption !== PaymentOption.CUSTOM) {
            return true;
          }

          if (!value) {
            return false;
          }

          return value > 0;
        },
      )
      .test(
        'max_amount_test',
        'payment_modal.payment_schedule.error.max_amount',
        function (value) {
          if (this.parent.paymentOption !== PaymentOption.CUSTOM) {
            return true;
          }

          if (!value) {
            return false;
          }

          return value <= maxAmount;
        },
      ),
  });
