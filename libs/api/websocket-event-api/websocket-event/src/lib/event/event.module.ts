import { Module } from '@nestjs/common';
import { EventQueueController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [],
  providers: [EventService],
  controllers: [EventQueueController],
})
export class EventModule {}
