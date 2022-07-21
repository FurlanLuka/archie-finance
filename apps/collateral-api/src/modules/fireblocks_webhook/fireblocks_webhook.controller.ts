import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookGuard } from './guard/fireblocks_webhook.guard';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { FireblocksWebhookError } from './fireblocks_webhook.errors';

@Controller('v1/fireblocks/webhook')
export class FireblocksWebhookController {
  constructor(private fireblocksWebhookService: FireblocksWebhookService) {}

  @Post('')
  @UseGuards(FireblocksWebhookGuard)
  @ApiErrorResponse([FireblocksWebhookError])
  public async webhook(@Body() body) {
    return this.fireblocksWebhookService.webhookHandler(body);
  }
}
