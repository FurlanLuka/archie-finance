import { Injectable, Logger } from '@nestjs/common';
import { GetKycResponse, GetKycPayload } from '@archie/api/user-api/kyc';
import { GetEmailAddressResponse } from '@archie/api/utils/interfaces/user';
import { InternalApiService } from '@archie/api/utils/internal';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
  Customer,
  DebitCard,
  DebitCardAccessToken,
  Transaction,
  TransactionEvent,
  TransactionStatus,
  TransactionType,
  RizeTransaction,
  CustomerEvent,
} from './api/rize_api.interfaces';
import { TransactionResponse } from './rize.interfaces';
import { RizeFactoryService } from './factory/rize_factory.service';
import { RizeValidatorService } from './validator/rize_validator.service';
import { CARD_ACTIVATED_TOPIC } from '@archie/api/credit-api/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Credit,
  CreditService,
  GetCreditResponse,
} from '@archie/api/credit-api/credit';
import { QueueService } from '@archie/api/utils/queue';
import { GET_USER_KYC_RPC } from '@archie/api/user-api/constants';

@Injectable()
export class RizeService {
  private rizeMessagingQueueClient;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
    private internalApiService: InternalApiService,
    private rizeApiService: RizeApiService,
    private rizeFactoryService: RizeFactoryService,
    private rizeValidatorService: RizeValidatorService,
    private queueService: QueueService,
    private creditService: CreditService,
  ) {
    this.rizeEventListener = this.rizeEventListener.bind(this);
    this.handleTransactionsEvent = this.handleTransactionsEvent.bind(this);
    this.handleCustomerActiveEvent = this.handleCustomerActiveEvent.bind(this);

    this.rizeMessagingQueueClient =
      rizeApiService.connectToRizeMessagingQueue();

    rizeApiService.subscribeToTopic(
      this.rizeMessagingQueueClient,
      'transaction',
      this.rizeEventListener(this.handleTransactionsEvent),
    );

    rizeApiService.subscribeToTopic(
      this.rizeMessagingQueueClient,
      'customer',
      this.rizeEventListener(this.handleCustomerActiveEvent),
    );
  }

  private rizeEventListener<T>(handler: (message: T) => Promise<void>) {
    return (err: Error, msg, ack, nack) => {
      if (!err) {
        try {
          msg.readString('UTF-8', (err, body) => {
            if (!err) {
              const message = JSON.parse(body);
              Logger.log({
                message: 'Rize event received',
                payload: message,
              });

              handler(message)
                .then(() => ack())
                .catch((error) => {
                  Logger.error({
                    message: 'Rize transaction event handling failed',
                    error,
                  });
                  nack();
                });
            } else {
              Logger.error({
                message: 'Rize transaction event message parsing failed',
              });
              nack();
            }
          });
        } catch (error) {
          Logger.error({
            message: 'Rize transaction event handling failed',
            error: error,
          });
          nack();
        }
      } else {
        Logger.error({
          message: 'Error from Rize received',
          error: err,
        });
        nack();
      }
    };
  }

  private async handleTransactionsEvent(message: TransactionEvent) {
    if (
      ![TransactionType.fee, TransactionType.credit].includes(
        message.data.details.type,
      ) &&
      message.data.details.new_status === TransactionStatus.settled
    ) {
      const userId: string = message.data.details.customer_external_uid;
      const amount: string = message.data.details.us_dollar_amount;
      const transactionId: string = message.data.details.transaction_uid;

      const transaction: RizeTransaction =
        await this.rizeApiService.getTransaction(transactionId);

      if (transaction.net_asset === 'negative') {
        await this.decreaseAvailableCredit(userId, Number(amount));
      } else {
        await this.increaseAvailableCredit(userId, Number(amount));
      }
    }
  }

  private async handleCustomerActiveEvent(message: CustomerEvent) {
    if (message.data.details.new_status === 'active') {
      const userId: string = message.data.details.external_uid;
      const customerId: string = message.data.details.customer_uid;

      await this.loadFunds(userId, customerId);
    }
  }

  private async decreaseAvailableCredit(userId: string, amount: number) {
    await this.creditRepository
      .createQueryBuilder('Credit')
      .update(Credit)
      .where('userId = :userId', { userId })
      .set({
        availableCredit: () => '"availableCredit" - :amount',
      })
      .setParameter('amount', amount)
      .execute();
  }

  private async increaseAvailableCredit(userId: string, amount: number) {
    await this.creditRepository
      .createQueryBuilder('Credit')
      .update(Credit)
      .where('userId = :userId', { userId })
      .set({
        availableCredit: () => '"availableCredit" + :amount',
      })
      .setParameter('amount', amount)
      .execute();
  }

  public async getVirtualCard(userId: string): Promise<string> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    const debitCard: DebitCard = await this.rizeApiService.getDebitCard(
      customer.uid,
    );
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
      status: txn.status,
      us_dollar_amount: txn.us_dollar_amount,
      created_at: txn.created_at,
      settled_at: txn.settled_at,
      description: txn.description,
      type: txn.type,
      is_adjustment: txn.adjustment_uid !== null,
      mcc: txn.mcc,
      merchant_location: txn.merchant_location,
      merchant_name: txn.merchant_name,
      merchant_number: txn.merchant_number,
      denial_reason: txn.denial_reason,
      net_asset: txn.net_asset,
    }));
  }

  public async createUser(userId: string, userIp: string): Promise<void> {
    const existingCustomer: Customer | null =
      await this.rizeApiService.searchCustomers(userId);
    this.rizeValidatorService.validateCustomerDoesNotExist(existingCustomer);

    const kyc: GetKycResponse = await this.queueService.request<
      GetKycResponse,
      GetKycPayload
    >(GET_USER_KYC_RPC, {
      userId,
    });

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
    this.queueService.publish(CARD_ACTIVATED_TOPIC, {
      userId,
      customerId,
    });
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

  public async loadFunds(userId: string, customerId: string): Promise<void> {
    const credit: GetCreditResponse = await this.creditService.getCredit(
      userId,
    );

    await this.rizeApiService.loadFunds(customerId, credit.availableCredit);
  }

  public async increaseCreditLimit(
    userId: string,
    amount: number,
  ): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );

    await this.rizeApiService.loadFunds(customer.uid, amount);
  }

  public async decreaseCreditLimit(
    userId: string,
    amount: number,
  ): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );

    await this.rizeApiService.decreaseCreditLimit(customer.uid, amount);
  }

  public async unlockCard(userId: string): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    const debitCard: DebitCard | null = await this.rizeApiService.getDebitCard(
      customer.uid,
    );

    if (debitCard !== null) {
      await this.rizeApiService.lockCard(debitCard.uid);
    }
  }

  public async lockCard(userId: string): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    const debitCard: DebitCard | null = await this.rizeApiService.getDebitCard(
      customer.uid,
    );

    if (debitCard !== null) {
      await this.rizeApiService.unlockCard(debitCard.uid);
    }
  }
}
