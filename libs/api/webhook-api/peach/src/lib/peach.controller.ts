import { Controller, Post } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';

@Controller('internal/webhook/peach')
export class PeachWebhookController {
  constructor(private peachWebhookService: PeachWebhookService) {}

  @Post('confirmed_payments')
  public async paymentAppliedHandler() {
    await this.peachWebhookService.handlePaymentConfirmedEvent();
  }
}
