import { Module } from '@nestjs/common';
import { EventQueueController } from './event.controller';
import { EventService } from './event.service';
import { WebsocketModule } from '@archie/api/websocket-event-api/websocket-event';

@Module({
  imports: [WebsocketModule],
  providers: [EventService],
  controllers: [EventQueueController],
})
export class EventModule {}
