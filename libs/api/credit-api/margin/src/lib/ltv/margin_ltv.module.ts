import { Module } from '@nestjs/common';
import { MarginLtvService } from './margin_ltv.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginNotification } from '../margin_notifications.entity';
import { CollateralValueModule } from '@archie/api/credit-api/collateral';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification]),
    CollateralValueModule,
  ],
  providers: [MarginLtvService],
  exports: [MarginLtvService],
})
export class MarginLtvModule {}
