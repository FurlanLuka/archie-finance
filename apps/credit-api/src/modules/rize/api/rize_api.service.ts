import { Injectable } from '@nestjs/common';
import { ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '../../../interfaces';
import Rize from '@rizefinance/rize-js';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
  ComplianceWorkflowMeta,
  Customer,
  CustomerDetails,
  RizeList,
  Product,
} from './rize_api.interfaces';

@Injectable()
export class RizeApiService {
  private rizeClient: Rize;
  private COMPLIANCE_PLAN_NAME = 'checking';

  constructor(private configService: ConfigService) {
    this.rizeClient = new Rize(
      configService.get(ConfigVariables.RIZE_PROGRAM_ID),
      configService.get(ConfigVariables.RIZE_HMAC_KEY),
    );
  }

  public async searchCustomers(userId: string): Promise<Customer | null> {
    const customers: RizeList<Customer> =
      await this.rizeClient.customer.getList({
        external_uid: userId,
        include_initiated: true,
      });

    return customers.data[0] ?? null;
  }

  public async createCustomer(userId: string, email: string): Promise<string> {
    const customer: Customer = await this.rizeClient.customer.create(
      userId,
      email,
    );

    return customer.uid;
  }

  public async addCustomerPii(
    customerUid: string,
    email: string,
    customerDetails: CustomerDetails,
  ): Promise<void> {
    await this.rizeClient.customer.update(
      customerUid,
      email,
      customerDetails,
      '',
    );
  }

  public async createCheckingComplianceWorkflow(
    customerId: string,
  ): Promise<ComplianceWorkflowMeta> {
    const products: RizeList<Product> = await this.rizeClient.product.getList();

    const product: Product = products.data.find(
      (product) => product.compliance_plan_name === this.COMPLIANCE_PLAN_NAME,
    );

    const complianceWorkflow: ComplianceWorkflow =
      await this.rizeClient.complianceWorkflow.create(
        customerId,
        product.product_compliance_plan_uid,
      );

    const steps: number[] = complianceWorkflow.all_documents.map(
      (document) => document.step,
    );

    return {
      product_uid: product.uid,
      compliance_workflow_uid: complianceWorkflow.uid,
      last_step: Math.max(...steps),
      current_step: complianceWorkflow.summary.current_step,
      pending_documents: complianceWorkflow.current_step_documents_pending.map(
        (doc) => doc.uid,
      ),
    };
  }

  public async acceptComplianceDocuments(
    customerId: string,
    complianceWorkflowUid: string,
    documents: ComplianceDocumentAcknowledgementRequest[],
  ): Promise<void> {
    await this.rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
      complianceWorkflowUid,
      customerId,
      documents,
    );
  }

  public async getLastComplianceWorkflow(
    customerId: string,
  ): Promise<ComplianceWorkflowMeta> {
    const complianceWorkflow: ComplianceWorkflow =
      await this.rizeClient.complianceWorkflow.viewLatest(customerId);

    const steps: number[] = complianceWorkflow.all_documents.map(
      (step) => step.step,
    );

    return {
      product_uid: complianceWorkflow.product_uid,
      compliance_workflow_uid: complianceWorkflow.uid,
      last_step: Math.max(...steps),
      current_step: complianceWorkflow.summary.current_step,
      pending_documents: complianceWorkflow.current_step_documents_pending.map(
        (doc) => doc.uid,
      ),
    };
  }

  public async createCustomerProduct(
    customerId: string,
    productId: string,
  ): Promise<void> {
    await this.rizeClient.customerProduct.create(customerId, productId);
  }
}
