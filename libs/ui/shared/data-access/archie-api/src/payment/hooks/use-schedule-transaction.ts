import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import {
  ScheduleTransactionBody,
  scheduleTransaction,
} from '../api/schedule-transaction';

export const useScheduleTransaction = (): MutationQueryResponse<
  ScheduleTransactionBody,
  void
> => {
  return useExtendedMutation<void, ScheduleTransactionBody>(
    'connect_account',
    scheduleTransaction,
  );
};
