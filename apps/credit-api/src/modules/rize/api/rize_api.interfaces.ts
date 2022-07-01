export {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
} from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
export {
  CustomerDetails,
  Customer,
} from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';

export interface ComplianceWorkflowMeta {
  product_uid: string;
  compliance_workflow_uid: string;
  current_step: number;
  last_step: number;
  pending_documents: string[];
}
