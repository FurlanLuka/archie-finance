import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LtvCredit } from '../credit.entity';
import { Repository } from 'typeorm';
import { LtvUpdatedUtilService } from '../utils/ltv_updated.service';
import { LtvPeriodicCheckRequestedPayload } from '@archie/api/ltv-api/data-transfer-objects';
import { QueueService } from '@archie/api/utils/queue';
import { LTV_PERIODIC_CHECK_REQUESTED_TOPIC } from '@archie/api/ltv-api/constants';

@Injectable()
export class PeriodicCheckService {
  constructor(
    @InjectRepository(LtvCredit)
    private ltvCreditRepository: Repository<LtvCredit>,
    private ltvUpdatedUtilService: LtvUpdatedUtilService,
    private queueService: QueueService,
  ) {}

  public async handlePeriodicLtvCheck(userIds: string[]): Promise<void> {
    await this.ltvUpdatedUtilService.publishMultipleLtvUpdatedEvent(userIds);
  }

  public async triggerPeriodicCheck(): Promise<void> {
    const QUEUE_EVENTS_LIMIT = 5000;

    const credits: LtvCredit[] = await this.ltvCreditRepository.find();

    const userIds: string[] = credits.map((credit) => credit.userId);

    const chunkSize: number = Math.ceil(userIds.length / QUEUE_EVENTS_LIMIT);

    for (let i = 0; i < userIds.length; i += chunkSize) {
      const userIdChunk: string[] = userIds.slice(i, i + chunkSize);

      this.queueService.publish<LtvPeriodicCheckRequestedPayload>(
        LTV_PERIODIC_CHECK_REQUESTED_TOPIC,
        {
          userIds: userIdChunk,
        },
      );
    }
  }
}
