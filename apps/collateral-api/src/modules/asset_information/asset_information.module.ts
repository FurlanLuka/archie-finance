import { Module } from '@nestjs/common';
import { InternalAssetInformationController } from './asset_information.controller';
import { AssetInformationService } from './asset_information.service';

@Module({
  providers: [AssetInformationService],
  controllers: [InternalAssetInformationController],
  exports: [AssetInformationService],
})
export class AssetInformationModule {}
