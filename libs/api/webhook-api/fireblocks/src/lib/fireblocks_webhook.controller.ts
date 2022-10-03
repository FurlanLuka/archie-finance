import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookGuard } from './guard/fireblocks_webhook.guard';

@Controller('v1/webhook/fireblocks')
export class FireblocksWebhookController {
  constructor(private fireblocksWebhookService: FireblocksWebhookService) {}

  @Post('')
  @UseGuards(FireblocksWebhookGuard)
  public async webhook(@Body() body) {
    Logger.log(JSON.stringify(body));
    return this.fireblocksWebhookService.webhookHandler(body);
  }
}
