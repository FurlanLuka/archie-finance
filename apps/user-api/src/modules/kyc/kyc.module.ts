import { VaultModule } from '@archie-microservices/vault';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalKycController, KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc]),
    VaultModule,
  ],
  controllers: [KycController, InternalKycController],
  providers: [KycService],
})
export class KycModule {}
