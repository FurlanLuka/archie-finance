import { Module } from '@nestjs/common';
import { AssetsModule } from '../assets/assets.module';
import { CreditLimitAssetAllocationService } from './credit_limit_asset_allocation.service';

@Module({
  imports: [AssetsModule],
  providers: [CreditLimitAssetAllocationService],
  exports: [CreditLimitAssetAllocationService],
})
export class CreditLimitAssetAllocationModule {}
