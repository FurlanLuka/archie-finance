import { Injectable, Logger } from '@nestjs/common';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { InternalApiService } from '@archie-microservices/internal-api';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflowMeta,
  Customer,
  CustomerDetails,
  DebitCard,
  Transaction,
  DebitCardAccessToken,
} from './api/rize_api.interfaces';
import {
  CustomerAlreadyExists,
  ActiveCustomerDoesNotExist,
  DebitCardAlreadyExists,
  DebitCardDoesNotExist,
} from './rize.errors';
import {
  TransactionResponse,
  TransactionStatus,
  TransactionType,
} from './rize.interfaces';

@Injectable()
export class RizeService {
  constructor(
    private internalApiService: InternalApiService,
    private rizeApiService: RizeApiService,
  ) {}

  public async createCard(userId: string): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.validateCustomerExists(customer);

    const debitCard: DebitCard = await this.rizeApiService.getDebitCard(
      customer.uid,
    );

    if (debitCard !== null) {
      Logger.error({
        code: 'DEBIT_CARD_ALREADY_EXISTS',
        metadata: {
          userId,
          customerId: customer.uid,
        },
      });

      throw new DebitCardAlreadyExists();
    }

    await this.rizeApiService.createDebitCard(
      userId,
      customer.uid,
      customer.pool_uids[0],
    );
  }

  public async getVirtualCard(userId: string): Promise<string> {
    const debitCard: DebitCard = await this.rizeApiService.getDebitCard(userId);

    if (debitCard === null) {
      Logger.error({
        code: 'DEBIT_CARD_DOES_NOT_EXIST',
        metadata: {
          userId,
        },
      });

      throw new DebitCardDoesNotExist();
    }
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

    this.validateCustomerExists(customer);

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

    if (existingCustomer !== null && existingCustomer.status === 'active') {
      Logger.error({
        code: 'CUSTOMER_ALREADY_EXISTS',
        metadata: {
          userId,
          customerId: existingCustomer.uid,
        },
      });

      throw new CustomerAlreadyExists();
    }

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
      this.createCustomerDetails(kyc),
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

  private validateCustomerExists(customer: Customer | null) {
    if (customer === null || customer.status !== 'active') {
      Logger.error({
        code: 'CUSTOMER_DOES_NOT_EXIST',
        metadata: {
          userId: customer.external_uid,
          customerId: customer.uid,
        },
      });

      throw new ActiveCustomerDoesNotExist();
    }
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
          this.createAcceptedComplianceDocument(documentId, userIp, userId),
        );

      await this.rizeApiService.acceptComplianceDocuments(
        customerId,
        complianceWorkflowDocuments.compliance_workflow_uid,
        docs,
      );
    }
  }

  private createAcceptedComplianceDocument(
    documentId: string,
    userIp: string,
    userId: string,
  ): ComplianceDocumentAcknowledgementRequest {
    return {
      accept: 'yes',
      document_uid: documentId,
      user_name: userId,
      ip_address: userIp,
    };
  }

  private createCustomerDetails(kyc: GetKycResponse): CustomerDetails {
    return {
      address: {
        city: kyc.addressLocality,
        street1: `${kyc.addressStreetNumber} ${kyc.addressStreet}`,
        state: kyc.addressRegion,
        postal_code: kyc.addressPostalCode,
      },
      business_name: null,
      dob: kyc.dateOfBirth,
      first_name: kyc.firstName,
      last_name: kyc.lastName,
      phone: kyc.phoneNumber,
      ssn: `${kyc.ssn.slice(0, 3)}-${kyc.ssn.slice(3, 5)}-${kyc.ssn.slice(5)}`,
    };
  }
}
