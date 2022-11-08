import { TransactionStatus, TransactionType } from '@archie/api/credit-api/data-transfer-objects/types';
/* eslint-disable */
export {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
} from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
export { CustomerDetails, Customer } from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';
export { RizeList } from '@rizefinance/rize-js/types/lib/core/typedefs/common.typedefs';
export { Product } from '@rizefinance/rize-js/types/lib/core/typedefs/product.typedefs';
export { DebitCard, DebitCardAccessToken } from '@rizefinance/rize-js/types/lib/core/typedefs/debit-card.typedefs';
export { Transaction } from '@rizefinance/rize-js/types/lib/core/typedefs/transaction.typedefs';

export interface AdjustmentType {
  uid: string;
  name: 'credit_limit_update_decrease' | 'credit_limit_update_increase';
  description: string;
  fee: boolean;
  program_uid: string;
}

export interface TransactionEvent {
  data: {
    details: TransactionEventDetails;
    event_type: string;
  };
  sequence: number;
  timestamp: string;
}

export interface TransactionEventDetails {
  asset_breakdown: any[];
  customer_external_uid: string;
  customer_uid: string;
  debit_card_uid: string | null;
  denial_reason: string | null;
  description: string | null;
  destination_synthetic_account_uid: string;
  new_status: TransactionStatus;
  settled_index: null | number;
  source_synthetic_account_uid: string;
  transaction_uid: string;
  type: TransactionType;
  us_dollar_amount: string;
}

export type CustomerStatus =
  | 'initiated'
  | 'queued'
  | 'identity_verified'
  | 'active'
  | 'manual_review'
  | 'rejected'
  | 'archived'
  | 'under_review'
  | 'pending_archival';

export interface CustomerEvent {
  data: {
    details: {
      new_status: CustomerStatus;
      customer_uid: string;
      external_uid: string;
      prior_status: CustomerStatus;
    };
    event_type: string;
  };
}
