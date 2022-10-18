import { UserObligations } from '@archie-microservices/ui/shared/data-access/archie-api/payment/api/get-obligations';

export const canUserSchedulePayment = (obligations: UserObligations) => {
  return obligations.fullBalance > 0;
};
