import { Injectable } from '@nestjs/common';
import { PeachApiService } from './api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { PeachEvent } from './peach_events.entity';
import { EventsResponse, Payment } from './api/peach_api.interfaces';
import { QueueService } from '@archie/api/utils/queue';
import { WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC } from '@archie/api/webhook-api/constants';
import { WebhookPaymentPayload } from './peach.dto';

@Injectable()
export class PeachWebhookService {
  constructor(
    @InjectRepository(PeachEvent)
    private peachEventRepository: Repository<PeachEvent>,
    private peachApi: PeachApiService,
    private queueService: QueueService,
  ) {}

  // This is just a temporary solution until Peach implements webhooks
  // Currently we just poll for new events
  public async handlePaymentConfirmedEvent() {
    const peachEvent: PeachEvent | null =
      await this.peachEventRepository.findOneBy({
        lastFetchedPaymentConfirmedEventId: Not(null),
      });

    const paymentEvents: EventsResponse<Payment> =
      await this.peachApi.getPaymentConfirmedEvent(
        peachEvent?.lastFetchedPaymentConfirmedEventId,
      );

    paymentEvents.data.forEach((event: Payment) => {
      this.queueService.publish<WebhookPaymentPayload>(
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
          uuid: peachEvent?.uuid,
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
