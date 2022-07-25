import { theme } from '@archie-webapps/shared/ui/theme';

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  FROZEN = 'frozen',
  REVRRSAL = 'reversal',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback',
}

export const TransactionStatusText = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.COMPLETED]: 'Completed',
  [TransactionStatus.DECLINED]: 'Declined',
  [TransactionStatus.FROZEN]: 'Frozen',
  [TransactionStatus.REVRRSAL]: 'Reversal',
  [TransactionStatus.REFUND]: 'Refund',
  [TransactionStatus.CHARGEBACK]: 'Chargeback',
};

export const TransactionStatusColor = {
  [TransactionStatus.PENDING]: theme.textSecondary,
  [TransactionStatus.COMPLETED]: theme.textSuccess,
  [TransactionStatus.DECLINED]: theme.textDanger,
  [TransactionStatus.FROZEN]: theme.textDanger,
  [TransactionStatus.REVRRSAL]: theme.textSuccess,
  [TransactionStatus.REFUND]: theme.textSuccess,
  [TransactionStatus.CHARGEBACK]: theme.textSuccess,
};
