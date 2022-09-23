import { Module } from '@nestjs/common';
import { CoingeckoApiModule } from './api/coingecko.module';
import { AssetsService } from './assets.service';

@Module({
  imports: [CoingeckoApiModule],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
