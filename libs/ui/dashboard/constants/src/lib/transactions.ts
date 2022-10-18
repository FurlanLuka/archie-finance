import {
  TransactionStatus,
  TransactionType,
} from '@archie-microservices/ui/shared/data-access/archie-api/payment/api/get-transactions';
import { theme } from '@archie-microservices/ui/shared/ui/theme';

export const TransactionStatusText = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.SETTLED]: 'Settled',
  [TransactionStatus.FAILED]: 'Failed',
  [TransactionStatus.QUEUED]: 'Queued',
};

export const TransactionTypeText = {
  [TransactionType.ATM_WITHDRAWAL]: 'ATM withdrawal',
  [TransactionType.CARD_PURCHASE]: 'Card purchase',
  [TransactionType.CARD_REFUND]: 'Card refund',
  [TransactionType.DISPUTE]: 'Dispute',
  [TransactionType.EXTERNAL_TRANSFER]: 'External transfer',
  [TransactionType.FEE]: 'Fee',
  [TransactionType.CREDIT]: 'Credit',
  [TransactionType.INTERNAL_TRANSFER]: 'Internal transfer',
  [TransactionType.OTHER]: 'Other',
  [TransactionType.REVERSED_TRANSFER]: 'Reversed transfer',
  [TransactionType.THIRD_PARTY_TRANSFER]: 'Third party_transfer',
  [TransactionType.BALANCE_PAYMENT]: 'Balance payment',
};

export const TransactionStatusColor = {
  [TransactionStatus.PENDING]: theme.textSecondary,
  [TransactionStatus.SETTLED]: theme.textSuccess,
  [TransactionStatus.FAILED]: theme.textDanger,
  [TransactionStatus.QUEUED]: theme.textPrimary,
};
