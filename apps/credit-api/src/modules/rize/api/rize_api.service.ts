import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
  DebitCard,
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
    try {
      const customers: RizeList<Customer> =
        await this.rizeClient.customer.getList({
          external_uid: userId,
          include_initiated: true,
        });

      return customers.data[0] ?? null;
    } catch (error) {
      Logger.error({
        code: 'ERROR_SEARCHING_EXISTING_CUSTOMER',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async createCustomer(userId: string, email: string): Promise<string> {
    try {
      const customer: Customer = await this.rizeClient.customer.create(
        userId,
        email,
      );

      return customer.uid;
    } catch (error) {
      Logger.error({
        code: 'ERROR_CREATING_CUSTOMER',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async addCustomerPii(
    customerUid: string,
    email: string,
    customerDetails: CustomerDetails,
  ): Promise<void> {
    try {
      await this.rizeClient.customer.update(
        customerUid,
        email,
        customerDetails,
        '',
      );
    } catch (error) {
      Logger.error({
        code: 'ERROR_UPDATING_CUSTOMER_PII',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async createCheckingComplianceWorkflow(
    customerId: string,
  ): Promise<ComplianceWorkflowMeta> {
    try {
      const products: RizeList<Product> =
        await this.rizeClient.product.getList();

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
        pending_documents:
          complianceWorkflow.current_step_documents_pending.map(
            (doc) => doc.uid,
          ),
      };
    } catch (error) {
      Logger.error({
        code: 'ERROR_CREATING_CHECKING_COMPLIANCE_WORKFLOW',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async acceptComplianceDocuments(
    customerId: string,
    complianceWorkflowUid: string,
    documents: ComplianceDocumentAcknowledgementRequest[],
  ): Promise<void> {
    try {
      await this.rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
        complianceWorkflowUid,
        customerId,
        documents,
      );
    } catch (error) {
      Logger.error({
        code: 'ERROR_ACKNOWLEDGING_COMPLIANCE_DOCUMENTS',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async getLatestComplianceWorkflow(
    customerId: string,
  ): Promise<ComplianceWorkflowMeta> {
    try {
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
        pending_documents:
          complianceWorkflow.current_step_documents_pending.map(
            (doc) => doc.uid,
          ),
      };
    } catch (error) {
      Logger.error({
        code: 'ERROR_FETCHING_LATEST_COMPLIANCE_DOCUMENTS',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async createCustomerProduct(
    customerId: string,
    productId: string,
  ): Promise<void> {
    try {
      await this.rizeClient.customerProduct.create(customerId, productId);
    } catch (error) {
      Logger.error({
        code: 'ERROR_CREATING_CUSTOMER_PRODUCT',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async createDebitCard(
    userId: string,
    customerId: string,
    poolId,
  ): Promise<DebitCard> {
    try {
      return this.rizeClient.debitCard.create(userId, customerId, poolId);
    } catch (error) {
      Logger.error({
        code: 'ERROR_CREATING_DEBIT_CARD',
        metadata: {
          error: error,
          errorResponse: error.data,
        },
      });

      throw new InternalServerErrorException();
    }
  }
}
