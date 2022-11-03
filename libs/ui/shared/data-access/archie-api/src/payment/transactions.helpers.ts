import { PaymentResponseData, PaymentStatus } from '@archie/api/peach-api/data-transfer-objects/types';

import { NetAsset, Transaction, TransactionStatus, TransactionType } from './api/get-transactions';

export const getTransactionsDateRange = (transactions: Transaction[]): { fromDate: string; toDate: string } | null => {
  if (transactions.length === 0) {
    return null;
  }

  const fromDate = transactions[transactions.length - 1].created_at;
  const toDate = transactions[0].created_at;

  return { fromDate, toDate };
};

// TODO check if everything is matching
const paymentStatusMap = new Map<PaymentStatus, TransactionStatus>([
  [PaymentStatus.scheduled, TransactionStatus.QUEUED],
  [PaymentStatus.initiated, TransactionStatus.PENDING],
  [PaymentStatus.pending, TransactionStatus.PENDING],
  [PaymentStatus.succeeded, TransactionStatus.SETTLED],
  [PaymentStatus.failed, TransactionStatus.FAILED],
  [PaymentStatus.inDispute, TransactionStatus.PENDING],
  [PaymentStatus.canceled, TransactionStatus.SETTLED],
  [PaymentStatus.chargeback, TransactionStatus.SETTLED],
]);

export const transformLoanPaymentIntoTransaction = (loanPayment: PaymentResponseData): Transaction => ({
  description: 'Archie credit payment',
  type: TransactionType.BALANCE_PAYMENT,
  status: paymentStatusMap.get(loanPayment.status) || TransactionStatus.PENDING,
  us_dollar_amount: loanPayment.actualAmount.toString(),
  settled_at: loanPayment.timestamps.succeededAt ?? '',
  created_at: loanPayment.timestamps.createdAt,
  is_adjustment: false,
  mcc: null,
  merchant_location: null,
  merchant_name: loanPayment.paymentDetails.paymentNetworkName,
  merchant_number: null,
  denial_reason: null,
  net_asset: NetAsset.POSITIVE,
});

export const mergeTransactionsWithLoanPayments = (
  transactions: Transaction[],
  loanPayments: PaymentResponseData[],
): Transaction[] => {
  const transformedPayments = loanPayments.map((payment) => transformLoanPaymentIntoTransaction(payment));

  return [...transactions, ...transformedPayments].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
