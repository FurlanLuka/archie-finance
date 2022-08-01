import { Module } from '@nestjs/common';
import { RizeController, RizeQueueController } from './rize.controller';
import { RizeService } from './rize.service';
import { RizeApiModule } from './api/rize_api.module';
import { RizeFactoryModule } from './factory/rize_factory.module';
import { RizeValidatorModule } from './validator/rize_validator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit, CreditModule } from '@archie/api/credit-api/credit';

@Module({
  controllers: [RizeController, RizeQueueController],
  providers: [RizeService],
  imports: [
    TypeOrmModule.forFeature([Credit]),
    RizeApiModule,
    RizeFactoryModule,
    RizeValidatorModule,
    CreditModule,
  ],
})
export class RizeModule {}
