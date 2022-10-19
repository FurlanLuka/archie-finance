import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EventType } from './fireblocks_webhook.interfaces';

export class FireblocksWebhookDto {
  @IsEnum(EventType)
  type: EventType;

  @IsString()
  tenantId: string;

  @IsNumber()
  timestamp: number;

  data: unknown;
}
