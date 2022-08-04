import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidApiModule } from './api/plaid-api.module';
import { PlaidController } from './plaid.controller';
import { PlaidService } from './plaid.service';

@Module({
  imports: [PlaidApiModule],
  exports: [PlaidService],
  providers: [PlaidService],
  controllers: [PlaidController],
})
export class PlaidModule {}
