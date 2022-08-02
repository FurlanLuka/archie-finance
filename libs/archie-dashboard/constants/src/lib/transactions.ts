import {
  TransactionStatus,
  TransactionType,
} from '@archie-webapps/shared/data-access/archie-api/payment/api/get-transactions';
import { theme } from '@archie-webapps/shared/ui/theme';

export const TransactionStatusText = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.SETTLED]: 'Settled',
  [TransactionStatus.FAILED]: 'Failed',
  [TransactionStatus.QUEUED]: 'Queued',
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
};

export const TransactionStatusColor = {
  [TransactionStatus.PENDING]: theme.textSecondary,
  [TransactionStatus.SETTLED]: theme.textSuccess,
  [TransactionStatus.FAILED]: theme.textDanger,
  [TransactionStatus.QUEUED]: theme.textPrimary,
};
