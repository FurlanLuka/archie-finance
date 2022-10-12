import { Module } from '@nestjs/common';
import { EventQueueController } from './event.controller';
import { EventService } from './event.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  providers: [EventService],
  controllers: [EventQueueController],
})
export class EventModule {}
