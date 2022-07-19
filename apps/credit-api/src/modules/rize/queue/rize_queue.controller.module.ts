import { Controller } from '@nestjs/common';
import { RizeService } from '../rize.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CARD_ACTIVATED_EXCHANGE,
  CREDIT_LIMIT_DECREASED,
  CREDIT_LIMIT_INCREASED,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import {
  CardActivatedDto,
  CreditLimitDto,
  MarginCallCompletedDto,
  MarginCallStartedDto,
} from '../rize.dto';

@Controller()
export class RizeQueueQueueController {
  constructor(private rizeService: RizeService) {}

  @Subscribe(MARGIN_CALL_STARTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallStartedHandler(payload: MarginCallStartedDto): Promise<void> {
    await this.rizeService.lockCard(payload.userId);
  }

  @Subscribe(MARGIN_CALL_COMPLETED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallCompletedHandler(
    payload: MarginCallCompletedDto,
  ): Promise<void> {
    await this.rizeService.unlockCard(payload.userId);
  }

  @Subscribe(CREDIT_LIMIT_DECREASED, SERVICE_QUEUE_NAME)
  async creditLimitDecreasedHandler(payload: CreditLimitDto): Promise<void> {
    await this.rizeService.decreaseCreditLimit(payload.userId, payload.amount);
  }

  @Subscribe(CREDIT_LIMIT_INCREASED, SERVICE_QUEUE_NAME)
  async creditLimitIncreasedHandler(payload: CreditLimitDto): Promise<void> {
    await this.rizeService.increaseCreditLimit(payload.userId, payload.amount);
  }

  @Subscribe(CARD_ACTIVATED_EXCHANGE, SERVICE_QUEUE_NAME)
  async cardActivatedHandler(payload: CardActivatedDto): Promise<void> {
    await this.rizeService.loadFunds(payload.userId, payload.customerId);
  }
}
