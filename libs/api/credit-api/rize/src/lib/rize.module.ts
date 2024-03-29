import { Module } from '@nestjs/common';
import { RizeController, RizeQueueController } from './rize.controller';
import { RizeService } from './rize.service';
import { RizeApiModule } from './api/rize_api.module';
import { RizeFactoryModule } from './factory/rize_factory.module';
import { RizeValidatorModule } from './validator/rize_validator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastDebitCardUpdateMeta } from './last_debit_card_update_meta.entity';

@Module({
  controllers: [RizeController, RizeQueueController],
  providers: [RizeService],
  imports: [
    RizeApiModule,
    RizeFactoryModule,
    RizeValidatorModule,
    TypeOrmModule.forFeature([LastDebitCardUpdateMeta]),
  ],
})
export class RizeModule {}
