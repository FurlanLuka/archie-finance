import { UserObligations } from '@archie-webapps/shared/data-access/archie-api/payment/payment.interfaces';

export const canUserSchedulePayment = (obligations: UserObligations) => {
  return obligations.fullBalance > 0;
};
