import { Injectable } from '@nestjs/common';
import { ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '../../../interfaces';
import Rize from '@rizefinance/rize-js';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceDocuments,
  Customer,
  CustomerDetails,
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
    const customers = await this.rizeClient.customer.getList({
      external_uid: userId,
      include_initiated: true,
    });
    console.log(customers);

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

  public async createCheckingComplianceDocuments(
    customerId: string,
  ): Promise<ComplianceDocuments> {
    const products = await this.rizeClient.product.getList();
    console.log('prodi', products);
    const product = products.data.find(
      (product) => product.compliance_plan_name === this.COMPLIANCE_PLAN_NAME,
    );
    console.log('prodi', product);

    // fallback check if compliance workflow already in progress
    const complianceWorkflow = await this.rizeClient.complianceWorkflow.create(
      customerId,
      product.product_compliance_plan_uid,
    );
    console.log('prodi', complianceWorkflow);

    return {
      product_uid: product.uid,
      compliance_workflow_uid: complianceWorkflow.uid,
      document_ids: complianceWorkflow.current_step_documents_pending.map(
        (document) => document.uid,
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

  public async createCustomerProduct(
    customerId: string,
    productId: string,
  ): Promise<void> {
    await this.rizeClient.customerProduct.create(customerId, productId);
  }
}
