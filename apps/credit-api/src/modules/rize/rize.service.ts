import { Injectable } from '@nestjs/common';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { InternalApiService } from '@archie-microservices/internal-api';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  Customer,
  DebitCard,
  Transaction,
  DebitCardAccessToken,
  ComplianceWorkflow,
} from './api/rize_api.interfaces';
import {
  TransactionResponse,
  TransactionStatus,
  TransactionType,
} from './rize.interfaces';
import { RizeFactoryService } from './factory/rize_factory.service';
import { RizeValidatorService } from './validator/rize_validator.service';
import { CARD_ACTIVATED_EXCHANGE } from '@archie/api/credit-api/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { GetCreditResponse } from '../credit/credit.interfaces';
import { CreditService } from '../credit/credit.service';

@Injectable()
export class RizeService {
  constructor(
    private internalApiService: InternalApiService,
    private rizeApiService: RizeApiService,
    private rizeFactoryService: RizeFactoryService,
    private rizeValidatorService: RizeValidatorService,
    private amqpConnection: AmqpConnection,
    private creditService: CreditService,
  ) {}

  public async createCard(userId: string): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    const debitCard: DebitCard = await this.rizeApiService.getDebitCard(userId);
    this.rizeValidatorService.validateDebitCardDoesNotExist(debitCard);

    await this.rizeApiService.createDebitCard(
      userId,
      customer.uid,
      customer.pool_uids[0],
    );
    const credit: GetCreditResponse = await this.creditService.getCredit(
      userId,
    );
    await this.rizeApiService.loadFunds(customer.uid, credit.availableCredit);

    await this.amqpConnection.publish(CARD_ACTIVATED_EXCHANGE.name, '', {
      userId: userId,
    });
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

    let complianceWorkflow: ComplianceWorkflow;
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
    complianceWorkflow: ComplianceWorkflow,
  ) {
    if (complianceWorkflow.current_step_documents_pending.length !== 0) {
      const docs: ComplianceDocumentAcknowledgementRequest[] =
        complianceWorkflow.current_step_documents_pending.map(
          (pendingDocument) =>
            this.rizeFactoryService.createAcceptedComplianceDocument(
              pendingDocument.uid,
              userIp,
              userId,
            ),
        );

      const updatedComplianceWorkflow: ComplianceWorkflow =
        await this.rizeApiService.acceptComplianceDocuments(
          customerId,
          complianceWorkflow.uid,
          docs,
        );

      await this.acceptAllDocuments(
        customerId,
        userId,
        userIp,
        updatedComplianceWorkflow,
      );
    }
  }

  public async unlockCard(userId: string): Promise<void> {
    const debitCard: DebitCard | null = await this.rizeApiService.getDebitCard(
      userId,
    );

    if (debitCard !== null) {
      await this.rizeApiService.lockCard(debitCard.uid);
    }
  }

  public async lockCard(userId: string): Promise<void> {
    const debitCard: DebitCard | null = await this.rizeApiService.getDebitCard(
      userId,
    );

    if (debitCard !== null) {
      await this.rizeApiService.unlockCard(debitCard.uid);
    }
  }
}
