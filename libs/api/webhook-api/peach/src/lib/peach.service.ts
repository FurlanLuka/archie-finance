import { Injectable } from '@nestjs/common';
import { PeachApiService } from './api/peach_api.service';
import { QueueService } from '@archie/api/utils/queue';

@Injectable()
export class PeachWebhookService {
  constructor(
    private peachApi: PeachApiService,
    private queueService: QueueService,
  ) {}

  public async handlePaymentConfirmedEvent(): Promise<void> {}
}
