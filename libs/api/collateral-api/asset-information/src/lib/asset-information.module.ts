import { Module } from '@nestjs/common';
import { AssetInformationQueueController } from './asset-information.controller';
import { AssetInformationService } from './asset-information.service';

@Module({
  providers: [AssetInformationService],
  controllers: [AssetInformationQueueController],
  exports: [AssetInformationService],
})
export class AssetInformationModule {}
