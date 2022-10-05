import { Module } from '@nestjs/common';
import { MathUtilService } from './math.service';
import { MarginActionsCheckUtilService } from './margin_actions_check.service';
import { MarginActionHandlersUtilService } from './margin_action_handlers.service';
import { MarginActionHandlersModule } from './margin_action_handlers/margin_action_handlers.module';

@Module({
  controllers: [],
  imports: [MarginActionHandlersModule],
  providers: [
    MathUtilService,
    MarginActionsCheckUtilService,
    MarginActionHandlersUtilService,
  ],
  exports: [
    MathUtilService,
    MarginActionsCheckUtilService,
    MarginActionHandlersUtilService,
  ],
})
export class UtilsModule {}
