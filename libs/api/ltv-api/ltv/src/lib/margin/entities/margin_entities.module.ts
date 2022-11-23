import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MarginNotification } from './margin_notifications.entity';
import { MarginEntitiesService } from './margin_entities.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarginCall, MarginCheck, MarginNotification]),
  ],
  providers: [MarginEntitiesService],
  exports: [MarginEntitiesService],
})
export class MarginEntitiesModule {}
