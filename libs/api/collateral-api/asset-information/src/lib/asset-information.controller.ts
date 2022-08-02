import { Controller } from '@nestjs/common';
import { AssetInformationService } from './asset-information.service';
import { AssetList } from './asset-information.interfaces';
import {
  RequestHandler,
  RPCResponse,
  RPCResponseType,
} from '@archie/api/utils/queue';
import {
  GET_ASSET_INFORMATION_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/collateral-api/constants';

@Controller()
export class AssetInformationQueueController {
  constructor(private assetInformationService: AssetInformationService) {}

  @RequestHandler(GET_ASSET_INFORMATION_RPC, SERVICE_QUEUE_NAME)
  getAssetList(): RPCResponse<AssetList> {
    try {
      const data = this.assetInformationService.getAssetList();

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message,
      };
    }
  }
}
