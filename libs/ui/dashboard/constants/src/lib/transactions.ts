import { TransactionStatus, TransactionType } from '@archie/api/credit-api/data-transfer-objects/types';
import { theme } from '@archie/ui/shared/theme';

export const TransactionStatusText = {
  [TransactionStatus.pending]: 'Pending',
  [TransactionStatus.settled]: 'Settled',
  [TransactionStatus.failed]: 'Failed',
  [TransactionStatus.queued]: 'Queued',
};

export const TransactionTypeText = {
  [TransactionType.atm_withdrawal]: 'ATM withdrawal',
  [TransactionType.card_purchase]: 'Card purchase',
  [TransactionType.card_refund]: 'Card refund',
  [TransactionType.dispute]: 'Dispute',
  [TransactionType.external_transfer]: 'External transfer',
  [TransactionType.fee]: 'Fee',
  [TransactionType.credit]: 'Credit',
  [TransactionType.internal_transfer]: 'Internal transfer',
  [TransactionType.other]: 'Other',
  [TransactionType.reversed_transfer]: 'Reversed transfer',
  [TransactionType.third_party_transfer]: 'Third party_transfer',
  [TransactionType.BALANCE_PAYMENT]: 'Balance payment',
};

export const TransactionStatusColor = {
  [TransactionStatus.pending]: theme.textSecondary,
  [TransactionStatus.settled]: theme.textSuccess,
  [TransactionStatus.failed]: theme.textDanger,
  [TransactionStatus.queued]: theme.textPrimary,
};
