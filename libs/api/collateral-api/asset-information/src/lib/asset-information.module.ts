import { Module } from '@nestjs/common';
import { InternalAssetInformationController } from './asset-information.controller';
import { AssetInformationService } from './asset-information.service';

@Module({
  providers: [AssetInformationService],
  controllers: [InternalAssetInformationController],
  exports: [AssetInformationService],
})
export class AssetInformationModule {}
