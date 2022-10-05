import { Module } from '@nestjs/common';
import { MarginService } from './margin.service';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MarginNotification } from './margin_notifications.entity';

@Module({
  controllers: [],
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([MarginCall, MarginCheck, MarginNotification]),
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
