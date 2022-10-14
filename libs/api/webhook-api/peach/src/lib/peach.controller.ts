import { Body, Controller, Post, Query, Request } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';

@Controller('v1/webhooks/peach')
export class PeachWebhookController {
  constructor(private peachWebhookService: PeachWebhookService) {}

  @Post('payments')
  public async peachPaymentsHandler(@Request() req, @Body() body: any) {
    console.log(req.headers);
    console.log(body);
    // await this.peachWebhookService.handlePaymentConfirmedEvent();
  }

  @Post('purchases')
  public async peachPurchasesHandler() {
    await this.peachWebhookService.handlePaymentConfirmedEvent();
  }
}
