/* eslint-disable */

import { Injectable, Logger } from '@nestjs/common';
import { GetKycPayload, GetKycResponse } from '@archie/api/user-api/kyc';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
  Customer,
  CustomerEvent,
  DebitCard,
  DebitCardAccessToken,
  RizeList,
  RizeTransaction,
  TransactionEvent,
  TransactionEventDetails,
  TransactionStatus,
  TransactionType,
} from './api/rize_api.interfaces';
import { Transaction, TransactionResponse } from './rize.interfaces';
import { RizeFactoryService } from './factory/rize_factory.service';
import { RizeValidatorService } from './validator/rize_validator.service';
import {
  CARD_ACTIVATED_TOPIC,
  CREDIT_FUNDS_LOADED_TOPIC,
  TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/credit-api/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Credit,
  CreditService,
  GetCreditResponse,
} from '@archie/api/credit-api/credit';
import { QueueService } from '@archie/api/utils/queue';
import {
  GET_USER_EMAIL_ADDRESS_RPC,
  GET_USER_KYC_RPC,
} from '@archie/api/user-api/constants';
import {
  GetEmailAddressPayload,
  GetEmailAddressResponse,
} from '@archie/api/user-api/user';
import {
  CardActivatedPayload,
  FundsLoadedPayload,
  TransactionUpdatedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { CardResponseDto, CardStatus } from './rize.dto';

@Injectable()
export class RizeService {
  private rizeMessagingQueueClient;

  constructor(
    @InjectRepository(Credit) private creditRepository: Repository<Credit>,
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
    const transactionDetails: TransactionEventDetails = message.data.details;

    if (
      ![TransactionType.fee, TransactionType.credit].includes(
        transactionDetails.type,
      )
    ) {
      const userId: string = transactionDetails.customer_external_uid;
      const amount: string = transactionDetails.us_dollar_amount;
      const transactionId: string = transactionDetails.transaction_uid;
      const newStatus: TransactionStatus = transactionDetails.new_status;

      const transaction: RizeTransaction =
        await this.rizeApiService.getTransaction(transactionId);

      if (transactionDetails.new_status === TransactionStatus.settled) {
        if (transaction.net_asset === 'negative') {
          await this.decreaseAvailableCredit(userId, Number(amount));
        } else {
          await this.increaseAvailableCredit(userId, Number(amount));
        }
      }

      this.queueService.publish<TransactionUpdatedPayload>(
        TRANSACTION_UPDATED_TOPIC,
        {
          ...transaction,
          userId,
          status: newStatus,
        },
      );
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

  public async getVirtualCard(userId: string): Promise<CardResponseDto> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    const debitCard: DebitCard | null = await this.rizeApiService.getDebitCard(
      customer.uid,
    );
    this.rizeValidatorService.validateDebitCardExists(debitCard);

    const debitCardAccessToken: DebitCardAccessToken =
      await this.rizeApiService.getDebitCardAccessToken(debitCard.uid);

    const image: string = await this.rizeApiService.getVirtualCardImage(
      debitCardAccessToken,
    );

    return {
      image,
      status:
        debitCard.locked_at !== null ? CardStatus.frozen : CardStatus.active,
      freezeReason: debitCard.lock_reason ?? null,
    };
  }

  public async getTransactions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<TransactionResponse> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    const rizeTransactions: RizeList<RizeTransaction> =
      await this.rizeApiService.getTransactions(customer.uid, page, limit);

    const transactions: Transaction[] = rizeTransactions.data.map(
      (txn: RizeTransaction) => ({
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
      }),
    );

    return {
      meta: {
        totalCount: rizeTransactions.total_count,
        count: rizeTransactions.count,
        limit,
        page,
      },
      data: transactions,
    };
  }

  public async createUser(userId: string, userIp: string): Promise<void> {
    const existingCustomer: Customer | null =
      await this.rizeApiService.searchCustomers(userId);
    this.rizeValidatorService.validateCustomerDoesNotExist(existingCustomer);

    const kyc: GetKycResponse = await this.queueService.request<
      GetKycResponse,
      GetKycPayload
    >(GET_USER_KYC_RPC, {
      userId: `${userId}`,
    });

    const emailAddressResponse: GetEmailAddressResponse =
      await this.queueService.request<
        GetEmailAddressResponse,
        GetEmailAddressPayload
      >(GET_USER_EMAIL_ADDRESS_RPC, {
        userId: `${userId}`,
      });

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
    this.queueService.publish<CardActivatedPayload>(CARD_ACTIVATED_TOPIC, {
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

    this.queueService.publish<FundsLoadedPayload>(CREDIT_FUNDS_LOADED_TOPIC, {
      userId,
      amount: credit.availableCredit,
    });
  }

  public async increaseCreditLimit(
    userId: string,
    amount: number,
  ): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    await this.rizeApiService.loadFunds(customer.uid, amount);
  }

  public async decreaseCreditLimit(
    userId: string,
    amount: number,
  ): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

    await this.rizeApiService.decreaseCreditLimit(customer.uid, amount);
  }

  public async unlockCard(userId: string): Promise<void> {
    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);

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
    this.rizeValidatorService.validateCustomerExists(customer);

    const debitCard: DebitCard | null = await this.rizeApiService.getDebitCard(
      customer.uid,
    );

    if (debitCard !== null) {
      await this.rizeApiService.unlockCard(debitCard.uid);
    }
  }
}
