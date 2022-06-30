export { ComplianceDocumentAcknowledgementRequest } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
export {
  CustomerDetails,
  Customer,
} from '@rizefinance/rize-js/types/lib/core/typedefs/customer.typedefs';

export interface ComplianceDocuments {
  product_uid: string;
  compliance_workflow_uid: string;
  document_ids: string[];
}
