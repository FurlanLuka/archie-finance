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
  TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/credit-api/constants';
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
  TransactionUpdatedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { CardResponseDto, CardStatus } from './rize.dto';
import { GET_LOAN_BALANCES_RPC } from '@archie/api/peach-api/constants';
import {
  CreditBalanceUpdatedPayload,
  GetLoanBalancesPayload,
  GetLoanBalancesResponse,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { LessThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LastDebitCardUpdateMeta } from './last_debit_card_update_meta.entity';
import { Lock } from '@archie-microservices/api/utils/redis';

@Injectable()
export class RizeService {
  private rizeMessagingQueueClient;

  constructor(
    private rizeApiService: RizeApiService,
    private rizeFactoryService: RizeFactoryService,
    private rizeValidatorService: RizeValidatorService,
    private queueService: QueueService,
    @InjectRepository(LastDebitCardUpdateMeta)
    private lastDebitCardUpdateMetaRepository: Repository<LastDebitCardUpdateMeta>,
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
      const transactionId: string = transactionDetails.transaction_uid;
      const newStatus: TransactionStatus = transactionDetails.new_status;

      const transaction: RizeTransaction =
        await this.rizeApiService.getTransaction(transactionId);

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
      await this.rizeApiService.getTransactions(customer.uid, page, limit, [
        'queued',
        'pending',
        'settled',
        'failed',
      ]);

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
    const credit = await this.queueService.request<
      GetLoanBalancesResponse,
      GetLoanBalancesPayload
    >(GET_LOAN_BALANCES_RPC, {
      userId,
    });

    await this.lastDebitCardUpdateMetaRepository.insert({
      userId,
      adjustmentCalculatedAt: credit.calculatedAt,
    });

    await this.rizeApiService.loadFunds(customerId, credit.availableCredit);
  }

  @Lock((credit: CreditBalanceUpdatedPayload) => credit.userId)
  public async updateAvailableCredit(
    credit: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    if (credit.paymentDetails?.type === PaymentType.purchase) {
      return;
    }

    const updateResult: UpdateResult =
      await this.lastDebitCardUpdateMetaRepository.update(
        {
          userId: credit.userId,
          adjustmentCalculatedAt: LessThanOrEqual(credit.calculatedAt),
        },
        {
          adjustmentCalculatedAt: credit.calculatedAt,
        },
      );

    if (updateResult.affected === 0) {
      return;
    }

    const customer: Customer | null = await this.rizeApiService.searchCustomers(
      credit.userId,
    );
    this.rizeValidatorService.validateCustomerExists(customer);
    const pendingTransactions: RizeList<RizeTransaction> =
      await this.rizeApiService.getTransactions(customer.uid, 0, 100, [
        'pending',
        'queued',
      ]);

    if (pendingTransactions.data.length !== 0) {
      throw new Error('Pending transactions in progress. Retry later');
    }
    const cardBalance: number = Number(customer.total_balance);

    if (credit.availableCreditAmount > cardBalance) {
      await this.rizeApiService.loadFunds(
        customer.uid,
        credit.availableCreditAmount - cardBalance,
      );
    }

    if (credit.availableCreditAmount < cardBalance) {
      await this.rizeApiService.decreaseCreditLimit(
        customer.uid,
        cardBalance - credit.availableCreditAmount,
      );
    }
  }

  @Lock((userId: string) => userId)
  public async unlockCard(userId: string, unlockAt: string): Promise<void> {
    const updateResult: UpdateResult =
      await this.lastDebitCardUpdateMetaRepository.update(
        {
          userId: userId,
          cardStatusChangedAt: LessThanOrEqual(unlockAt),
        },
        {
          cardStatusChangedAt: unlockAt,
        },
      );

    if (updateResult.affected === 0) {
      return;
    }

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

  @Lock((userId: string) => userId)
  public async lockCard(userId: string, lockAt: string): Promise<void> {
    const updateResult: UpdateResult =
      await this.lastDebitCardUpdateMetaRepository.update(
        {
          userId: userId,
          cardStatusChangedAt: LessThanOrEqual(lockAt),
        },
        {
          cardStatusChangedAt: lockAt,
        },
      );

    if (updateResult.affected === 0) {
      return;
    }

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
}
