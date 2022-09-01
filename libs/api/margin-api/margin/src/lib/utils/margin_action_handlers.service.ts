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

  public async handle(
    actions: MarginAction[],
    ltv: LtvUpdatedPayload,
  ): Promise<void> {
    const handlers: Record<
      MarginAction,
      (ltv: LtvUpdatedPayload) => Promise<void>
    > = {
      [MarginAction.send_margin_call_in_danger_notification]:
        this.marginCallInDangerService.send,
      [MarginAction.reset_margin_call_in_danger_notifications]:
        this.marginCallInDangerService.reset,
      [MarginAction.activate_margin_call]: this.marginCallService.activate,
      [MarginAction.deactivate_margin_call]: this.marginCallService.deactivate,
      [MarginAction.liquidate]: this.marginCallService.liquidate,
    };

    for (const action of actions) {
      await handlers[action](ltv);
    }
  }
}
