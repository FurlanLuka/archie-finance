import { Injectable } from '@nestjs/common';
import { PeachApiService } from './api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeachEvent } from './peach_events.entity';
import { EventsResponse, Payment } from './api/peach_api.interfaces';
import { QueueService } from '@archie/api/utils/queue';
import { WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC } from '@archie/api/webhook-api/constants';
import { PeachWebhookPaymentPayload } from '@archie/api/webhook-api/data-transfer-objects';

@Injectable()
export class PeachWebhookService {
  PAYMENT_CONFIRMED_EVENT_UUID = 'ab4012cc-8042-4911-90d4-85cb32b665e5';

  constructor(
    @InjectRepository(PeachEvent)
    private peachEventRepository: Repository<PeachEvent>,
    private peachApi: PeachApiService,
    private queueService: QueueService,
  ) {}

  public async publishPaymentConfirmedEvent(body: PeachWebhookPaymentPayload) {
    this.queueService.publish<PeachWebhookPaymentPayload>(
      WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC,
      body,
    );
  }

  // This is just a temporary solution until Peach implements webhooks
  // Currently we just poll for new events
  public async handlePaymentConfirmedEvent(): Promise<void> {
    const peachEvent: PeachEvent | null =
      await this.peachEventRepository.findOneBy({
        uuid: this.PAYMENT_CONFIRMED_EVENT_UUID,
      });

    const paymentEvents: EventsResponse<Payment> =
      await this.peachApi.getPaymentConfirmedEvent(
        peachEvent?.lastFetchedPaymentConfirmedEventId,
      );

    paymentEvents.data.forEach((event: Payment) => {
      this.queueService.publish<PeachWebhookPaymentPayload>(
        WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC,
        {
          ...event,
          amount: event.amount / 100, // Peach returns amount in cents eg. 1100 for 11.00$
        },
      );
    });

    if (paymentEvents.data.length > 0) {
      const lastEvent: Payment =
        paymentEvents.data[paymentEvents.data.length - 1];

      await this.peachEventRepository.upsert(
        {
          uuid: this.PAYMENT_CONFIRMED_EVENT_UUID,
          lastFetchedPaymentConfirmedEventId: lastEvent.id,
        },
        {
          conflictPaths: ['uuid'],
        },
      );

      if (paymentEvents.nextUrl !== null) {
        await this.handlePaymentConfirmedEvent();
      }
    }
  }
}
