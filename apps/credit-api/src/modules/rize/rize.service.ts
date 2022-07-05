import { Injectable } from '@nestjs/common';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { InternalApiService } from '@archie-microservices/internal-api';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflowMeta,
  Customer,
  DebitCard,
  Transaction,
  DebitCardAccessToken,
} from './api/rize_api.interfaces';
import {
  TransactionResponse,
  TransactionStatus,
  TransactionType,
} from './rize.interfaces';
import { RizeFactoryService } from './factory/rize_factory.service';
import { RizeValidatorService } from './validator/rize_validator.service';

@Injectable()
export class RizeService {
  constructor(
    private internalApiService: InternalApiService,
    private rizeApiService: RizeApiService,
    private rizeFactoryService: RizeFactoryService,
    private rizeValidatorService: RizeValidatorService,
  ) {}

  public async createCard(userId: string): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    const debitCard: DebitCard = await this.rizeApiService.getDebitCard(
      customer.uid,
    );
    this.rizeValidatorService.validateDebitCardDoesNotExist(debitCard);

    await this.rizeApiService.createDebitCard(
      userId,
      customer.uid,
      customer.pool_uids[0],
    );
    // TODO: load funds
    await this.internalApiService.completeOnboardingStage(
        'cardActivationStage',
        userId,
    );
  }

  public async getVirtualCard(userId: string): Promise<string> {
    const debitCard: DebitCard = await this.rizeApiService.getDebitCard(userId);
    this.rizeValidatorService.validateDebitCardExists(debitCard);

    const debitCardAccessToken: DebitCardAccessToken =
      await this.rizeApiService.getDebitCardAccessToken(debitCard.uid);

    return this.rizeApiService.getVirtualCardImage(debitCardAccessToken);
  }

  public async getTransactions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<TransactionResponse[]> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    const transactions: Transaction[] =
      await this.rizeApiService.getTransactions(customer.uid, page, limit);

    return transactions.map((txn: Transaction) => ({
      status: <TransactionStatus>txn.status,
      amount: txn.us_dollar_amount,
      created_at: txn.created_at,
      settled_at: txn.settled_at,
      description: txn.description,
      type: <TransactionType>txn.type,
    }));
  }

  public async createUser(userId: string, userIp: string): Promise<void> {
    const existingCustomer: Customer | null =
      await this.rizeApiService.searchCustomers(userId);
    this.rizeValidatorService.validateCustomerDoesNotExist(existingCustomer);

    const kyc: GetKycResponse = await this.internalApiService.getKyc(userId);
    const emailAddressResponse: GetEmailAddressResponse =
      await this.internalApiService.getUserEmailAddress(userId);

    const customerId: string =
      existingCustomer !== null
        ? existingCustomer.uid
        : await this.rizeApiService.createCustomer(
            userId,
            emailAddressResponse.email,
          );

    await this.rizeApiService.addCustomerPii(
      customerId,
      emailAddressResponse.email,
      this.rizeFactoryService.createCustomerDetails(kyc),
    );

    let complianceWorkflow: ComplianceWorkflowMeta;
    try {
      complianceWorkflow =
        await this.rizeApiService.createCheckingComplianceWorkflow(customerId);
    } catch {
      complianceWorkflow =
        await this.rizeApiService.getLatestComplianceWorkflow(customerId);
    }

    await this.acceptAllDocuments(
      customerId,
      userId,
      userIp,
      complianceWorkflow,
    );

    await this.rizeApiService.createCustomerProduct(
      customerId,
      complianceWorkflow.product_uid,
    );
  }

  private async acceptAllDocuments(
    customerId: string,
    userId: string,
    userIp: string,
    complianceWorkflow: ComplianceWorkflowMeta,
  ) {
    for (
      let step = complianceWorkflow.current_step;
      step <= complianceWorkflow.last_step;
      step++
    ) {
      const complianceWorkflowDocuments =
        step === complianceWorkflow.current_step
          ? complianceWorkflow
          : await this.rizeApiService.getLatestComplianceWorkflow(customerId);

      if (complianceWorkflowDocuments.pending_documents.length === 0) {
        break;
      }
      const docs: ComplianceDocumentAcknowledgementRequest[] =
        complianceWorkflowDocuments.pending_documents.map((documentId) =>
          this.rizeFactoryService.createAcceptedComplianceDocument(
            documentId,
            userIp,
            userId,
          ),
        );

      await this.rizeApiService.acceptComplianceDocuments(
        customerId,
        complianceWorkflowDocuments.compliance_workflow_uid,
        docs,
      );
    }
  }
}
