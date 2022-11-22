import { Module } from '@nestjs/common';
import { MarginService } from './margin.service';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MarginNotification } from './margin_notifications.entity';
import { Liquidation } from '../liquidation/liquidation.entity';
import { MarginController } from './margin.controller';

@Module({
  controllers: [MarginController],
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([
      MarginCall,
      MarginCheck,
      MarginNotification,
      Liquidation,
    ]),
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
