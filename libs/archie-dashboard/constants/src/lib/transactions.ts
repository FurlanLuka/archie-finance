import { TransactionStatus } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-transactions';
import { theme } from '@archie-webapps/shared/ui/theme';

export const TransactionStatusText = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.SETTLED]: 'Settled',
  [TransactionStatus.FAILED]: 'Failed',
  [TransactionStatus.QUEUED]: 'Queued',
};

export const TransactionStatusColor = {
  [TransactionStatus.PENDING]: theme.textSecondary,
  [TransactionStatus.SETTLED]: theme.textSuccess,
  [TransactionStatus.FAILED]: theme.textDanger,
  [TransactionStatus.QUEUED]: theme.textPrimary,
};
