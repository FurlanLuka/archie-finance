import { Injectable } from '@nestjs/common';
import { PeachApiService } from './api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { PeachEvent } from './peach_events.entity';
import { EventsResponse, PaymentApplied } from './api/peach_api.interfaces';
import { QueueService } from '@archie/api/utils/queue';
import { WEBHOOK_PAYMENT_APPLIED_TOPIC } from '@archie/api/webhook-api/constants';
import { WebhookPaymentAppliedPayload } from './peach.dto';

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
  public async handlePaymentAppliedEvent() {
    const peachEvent: PeachEvent | null =
      await this.peachEventRepository.findOneBy({
        lastFetchedPaymentAppliedEventId: Not(null),
      });

    const paymentAppliedEvents: EventsResponse<PaymentApplied> =
      await this.peachApi.getPaymentAppliedEvent(
        peachEvent?.lastFetchedPaymentAppliedEventId,
      );

    paymentAppliedEvents.data.forEach((event: PaymentApplied) => {
      console.log(event);
      this.queueService.publish<WebhookPaymentAppliedPayload>(
        WEBHOOK_PAYMENT_APPLIED_TOPIC,
        {
          ...event,
          amount: event.amount / 100, // Peach returns amount without decimals eg. 1100 for 11.00$
        },
      );
    });

    if (paymentAppliedEvents.data.length > 0) {
      const lastEvent: PaymentApplied =
        paymentAppliedEvents.data[paymentAppliedEvents.data.length - 1];

      await this.peachEventRepository.upsert(
        {
          uuid: peachEvent?.uuid,
          lastFetchedPaymentAppliedEventId: lastEvent.id,
        },
        {
          conflictPaths: ['uuid'],
        },
      );

      if (paymentAppliedEvents.nextUrl !== null) {
        await this.handlePaymentAppliedEvent();
      }
    }
  }
}
