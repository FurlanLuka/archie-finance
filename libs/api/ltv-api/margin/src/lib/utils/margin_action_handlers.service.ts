import { Injectable } from '@nestjs/common';
import { MarginAction } from './utils.interfaces';
import { MarginCallInDangerHandlerService } from './margin_action_handlers/margin_call_in_danger_handler.service';
import { MarginCallHandlerService } from './margin_action_handlers/margin_call_handler.service';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects';

@Injectable()
export class MarginActionHandlersUtilService {
  constructor(
    private marginCallInDangerService: MarginCallInDangerHandlerService,
    private marginCallService: MarginCallHandlerService,
  ) {}

  handlers: Record<MarginAction, (ltv: LtvUpdatedPayload) => Promise<void>> = {
    [MarginAction.send_margin_call_in_danger_notification]:
      this.marginCallInDangerService.send.bind(this.marginCallInDangerService),
    [MarginAction.reset_margin_call_in_danger_notifications]:
      this.marginCallInDangerService.reset.bind(this.marginCallInDangerService),
    [MarginAction.activate_margin_call]: this.marginCallService.activate.bind(
      this.marginCallService,
    ),
    [MarginAction.deactivate_margin_call]:
      this.marginCallService.deactivate.bind(this.marginCallService),
    [MarginAction.liquidate]: this.marginCallService.liquidate.bind(
      this.marginCallService,
    ),
  };

  public async handle(
    actions: MarginAction[],
    ltv: LtvUpdatedPayload,
  ): Promise<void> {
    for (const action of actions) {
      await this.handlers[action](ltv);
    }
  }
}
