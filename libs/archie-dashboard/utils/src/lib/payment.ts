import { UserObligations } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-obligations';

export const canUserSchedulePayment = (obligations: UserObligations) => {
  return obligations.fullBalance > 0;
};
