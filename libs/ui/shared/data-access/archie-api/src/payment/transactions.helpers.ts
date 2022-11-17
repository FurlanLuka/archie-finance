import {
  NetAsset,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@archie/api/credit-api/data-transfer-objects/types';
import {
  PaymentResponseData,
  PaymentStatus,
} from '@archie/api/peach-api/data-transfer-objects/types';

export const getTransactionsDateRange = (
  transactions: Transaction[],
): { fromDate: string; toDate: string } | null => {
  if (transactions.length === 0) {
    return null;
  }

  const fromDate = transactions[transactions.length - 1].created_at;
  const toDate = transactions[0].created_at;

  return { fromDate, toDate };
};

// TODO check if everything is matching
const paymentStatusMap = new Map<PaymentStatus, TransactionStatus>([
  [PaymentStatus.scheduled, TransactionStatus.queued],
  [PaymentStatus.initiated, TransactionStatus.pending],
  [PaymentStatus.pending, TransactionStatus.pending],
  [PaymentStatus.succeeded, TransactionStatus.settled],
  [PaymentStatus.failed, TransactionStatus.failed],
  [PaymentStatus.inDispute, TransactionStatus.pending],
  [PaymentStatus.canceled, TransactionStatus.settled],
  [PaymentStatus.chargeback, TransactionStatus.settled],
]);

export const transformLoanPaymentIntoTransaction = (
  loanPayment: PaymentResponseData,
): Transaction => ({
  description: 'Archie credit payment',
  type: TransactionType.BALANCE_PAYMENT,
  status: paymentStatusMap.get(loanPayment.status) || TransactionStatus.pending,
  us_dollar_amount: loanPayment.actualAmount.toString(),
  settled_at: loanPayment.timestamps.succeededAt ?? '',
  created_at: loanPayment.timestamps.createdAt,
  is_adjustment: false,
  mcc: null,
  merchant_location: null,
  merchant_name: loanPayment.paymentDetails.paymentNetworkName,
  merchant_number: null,
  denial_reason: null,
  net_asset: NetAsset.positive,
});

export const mergeTransactionsWithLoanPayments = (
  transactions: Transaction[],
  loanPayments: PaymentResponseData[],
): Transaction[] => {
  const transformedPayments = loanPayments.map((payment) =>
    transformLoanPaymentIntoTransaction(payment),
  );

  return [...transactions, ...transformedPayments].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
