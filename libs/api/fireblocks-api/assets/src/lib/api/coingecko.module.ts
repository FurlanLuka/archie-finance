import { Module } from '@nestjs/common';
import { CoingeckoApiService } from './coingecko.service';

@Module({
  providers: [CoingeckoApiService],
  exports: [CoingeckoApiService],
})
export class CoingeckoApiModule {}
