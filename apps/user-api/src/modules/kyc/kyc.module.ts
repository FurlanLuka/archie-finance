import { VaultModule } from '@archie-microservices/vault';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Kyc]), VaultModule],
  controllers: [KycController],
  providers: [KycService],
})
export class KycModule {}
