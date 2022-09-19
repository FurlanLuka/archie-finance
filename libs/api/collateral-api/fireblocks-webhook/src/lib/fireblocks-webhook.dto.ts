import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EventType } from './fireblocks-webhook.interfaces';

export class FireblocksWebhookDto {
  @IsEnum(EventType)
  type: EventType;

  @IsString()
  tenantId: string;

  @IsNumber()
  timestamp: number;

  // eslint-disable-next-line
  data: any;
}
