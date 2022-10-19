import { Injectable } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { SALES_CONNECT_TOPIC } from '@archie/api/referral-system-api/constants';
import { SalesConnectDto } from './sales_connect.dto';

@Injectable({})
export class SalesConnectService {
  constructor(private queueService: QueueService) {}

  public connect(dto: SalesConnectDto): void {
    this.queueService.publishEvent(SALES_CONNECT_TOPIC, dto);
  }
}
