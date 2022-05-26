import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookGuard } from './guard/fireblocks_webhook.guard';

@Controller('v1/fireblocks/webhook')
export class FireblocksWebhookController {
  constructor(private fireblocksWebhookService: FireblocksWebhookService) {}

  @Post('')
  @UseGuards(FireblocksWebhookGuard)
  public webhook(@Body() body: any) {
    return this.fireblocksWebhookService.webhookHandler(body);
  }
}
