import { Module } from '@nestjs/common';
import { PlaidApiService } from './plaid-api.service';

@Module({
  imports: [],
  providers: [PlaidApiService],
  exports: [PlaidApiService],
})
export class PlaidApiModule {}
