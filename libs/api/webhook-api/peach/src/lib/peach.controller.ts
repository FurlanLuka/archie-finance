import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';
import { PeachWebhookGuard } from './guard/peach_webhook.guard';

@Controller('v1/webhooks/peach')
export class PeachWebhookController {
  constructor(private peachWebhookService: PeachWebhookService) {}

  @Post('payments')
  @UseGuards(PeachWebhookGuard)
  public async peachPaymentsHandler(@Body() body) {
    await this.peachWebhookService.handlePaymentEvent(body);
  }
}
