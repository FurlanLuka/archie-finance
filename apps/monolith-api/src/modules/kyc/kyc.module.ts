import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultModule } from '../vault/vault.module';
import { KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Kyc]), VaultModule],
  controllers: [KycController],
  providers: [KycService],
})
export class KycModule {}
