import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycQueueController, KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Kyc])],
  controllers: [KycController, KycQueueController],
  providers: [KycService],
})
export class KycModule {}
