import {
  NetAsset,
  Transaction,
} from '@archie-webapps/shared/data-access/archie-api/payment/api/get-transactions';

export const getRowDescription = (
  transaction: Transaction,
): { title: string; code: string } => {
  if (transaction.is_adjustment) {
    if (transaction.net_asset === NetAsset.POSITIVE) {
      return {
        title: 'Archie credit deposit',
        code: '',
      };
    }
    return {
      title: 'Archie credit withdrawal',
      code: '',
    };
  }

  return {
    title: transaction.merchant_name ?? '',
    code: transaction.merchant_number ?? '',
  };
};
