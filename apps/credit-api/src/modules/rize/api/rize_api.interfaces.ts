export {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
} from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
export {
  CustomerDetails,
  Customer,
} from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';
export { RizeList } from '@rizefinance/rize-js/types/lib/core/typedefs/common.typedefs';
export { Product } from '@rizefinance/rize-js/types/lib/core/typedefs/product.typedefs';
export {
  DebitCard,
  DebitCardAccessToken,
} from '@rizefinance/rize-js/types/lib/core/typedefs/debit-card.typedefs';
export { Transaction } from '@rizefinance/rize-js/types/lib/core/typedefs/transaction.typedefs';

export interface AdjustmentType {
  uid: string;
  name: 'credit_limit_update_decrease' | 'credit_limit_update_increase';
  description: string;
  fee: boolean;
  program_uid: string;
}
