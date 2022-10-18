import { Injectable } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { WEBHOOK_PEACH_PAYMENT_UPDATED_TOPIC } from '@archie/api/webhook-api/constants';
import { PeachWebhookPayload } from '@archie/api/webhook-api/data-transfer-objects';

@Injectable()
export class PeachWebhookService {
  constructor(private queueService: QueueService) {}

  public async handlePaymentEvent(payment: PeachWebhookPayload): Promise<void> {
    const transaction = payment.transaction;

    this.queueService.publishEvent(WEBHOOK_PEACH_PAYMENT_UPDATED_TOPIC, {
      userId: payment.borrower.externalId,
      borrowerId: payment.borrowerId,
      loanId: payment.loanId,
      transaction: {
        id: payment.transactionId,
        actualAmount: transaction.actualAmount,
        paymentDetails: {
          fromInstrumentId: transaction.paymentDetails.fromInstrumentId,
        },
        status: transaction.status,
        drawId: transaction.drawId,
        externalId: transaction.externalId,
        metaData: transaction.metaData,
        parentTransactionId: transaction.parentTransactionId,
        currency: payment.currency,
      },
    });
  }
}
