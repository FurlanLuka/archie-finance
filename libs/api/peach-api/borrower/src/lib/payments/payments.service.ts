import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Credit,
  PaymentInstrument,
  Payments,
  PeachOneTimePaymentStatus,
} from '../api/peach_api.interfaces';
import {
  GetPaymentsQueryDto,
  PaymentsResponseDto,
  ScheduleTransactionDto,
} from './payments.dto';
import { PaymentsResponseFactory } from './utils/payments_response.factory';
import { PeachPaymentUpdatedPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { PaymentType } from '@archie/api/peach-api/data-transfer-objects';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { BorrowerValidation } from '../utils/borrower.validation';
import { Injectable } from '@nestjs/common';
import { PaypalPaymentReceivedPayload } from '@archie/api/paypal-api/paypal';
import {
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects/types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private peachApiService: PeachApiService,
    private paymentsResponseFactory: PaymentsResponseFactory,
    private queueService: QueueService,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async getPayments(
    userId: string,
    query: GetPaymentsQueryDto,
  ): Promise<PaymentsResponseDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const payments: Payments = await this.peachApiService.getPayments(
      borrower.personId,
      borrower.creditLineId,
      query,
    );

    return this.paymentsResponseFactory.create(payments, query.limit);
  }

  public async scheduleTransaction(
    userId: string,
    transaction: ScheduleTransactionDto,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerDrawDefined(borrower);

    await this.peachApiService.createOneTimeTransaction(
      borrower,
      transaction.amount,
      transaction.paymentInstrumentId,
      transaction.scheduledDate,
    );
  }

  public async handleCollateralLiquidationEvent({
    userId,
    action,
  }: LedgerAccountUpdatedPayload): Promise<void> {
    if (action.type !== LedgerActionType.LIQUIDATION) {
      return;
    }

    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    let liquidationInstrumentId: string | null =
      borrower.liquidationInstrumentId;

    if (liquidationInstrumentId === null) {
      const paymentInstrument: PaymentInstrument =
        await this.peachApiService.createLiquidationPaymentInstrument(
          borrower.personId,
        );
      liquidationInstrumentId = paymentInstrument.id;

      await this.borrowerRepository.update(
        {
          userId: userId,
        },
        {
          liquidationInstrumentId,
        },
      );
    }

    await this.peachApiService.tryCreatingOneTimePaymentTransaction(
      borrower,
      liquidationInstrumentId,
      Number(action.liquidation.usdAmount),
      action.liquidation.id,
      PeachOneTimePaymentStatus.succeeded,
    );
  }

  public async handlePaypalPaymentReceivedEvent(
    payload: PaypalPaymentReceivedPayload,
  ): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId: payload.userId,
    });

    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    let paypalInstrumentId: string | null = borrower.paypalInstrumentId;

    if (paypalInstrumentId === null) {
      const paymentInstrument: PaymentInstrument =
        await this.peachApiService.createPaypalPaymentInstrument(
          borrower.personId,
        );

      paypalInstrumentId = paymentInstrument.id;

      await this.borrowerRepository.update(
        {
          userId: payload.userId,
        },
        {
          paypalInstrumentId,
        },
      );
    }

    await this.peachApiService.tryCreatingOneTimePaymentTransaction(
      borrower,
      paypalInstrumentId,
      payload.amount,
      payload.orderId,
      PeachOneTimePaymentStatus.succeeded,
    );
  }

  public async handlePaymentUpdatedEvent({
    userId,
    transaction,
  }: PeachPaymentUpdatedPayload): Promise<void> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const credit: Credit = await this.peachApiService.getCreditBalance(
      borrower.personId,
      borrower.creditLineId,
    );

    return this.queueService.publishEvent(CREDIT_BALANCE_UPDATED_TOPIC, {
      ...credit,
      userId,
      paymentDetails: {
        type:
          transaction.paymentDetails.fromInstrumentId ===
          borrower.liquidationInstrumentId
            ? PaymentType.liquidation
            : PaymentType.payment,
        amount: transaction.actualAmount,
        asset: transaction.currency,
        id: transaction.externalId,
      },
    });
  }
}
