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

export interface ComplianceWorkflowMeta {
  product_uid: string;
  compliance_workflow_uid: string;
  current_step: number;
  last_step: number;
  pending_documents: string[];
}
