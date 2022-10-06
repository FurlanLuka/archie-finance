import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import {
  GetCollateralPayload,
  GetCollateralResponse,
  GetCollateralValuePayload,
  GetCollateralValueResponse,
  GetTotalCollateralValueResponse,
} from './collateral.interfaces';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  COLLATERAL_DEPOSITED_TOPIC,
  GET_COLLATERAL_RPC,
  GET_COLLATERAL_VALUE_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import {
  RequestHandler,
  RPCResponse,
  RPCResponseType,
  Subscribe,
} from '@archie/api/utils/queue';
import {
  CollateralDepositedPayload,
  InternalCollateralTransactionCompletedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import { MARGIN_CALL_COMPLETED_TOPIC } from '@archie/api/ltv-api/constants';
import { INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC } from '@archie/api/collateral-api/constants';
import { MarginCallCompletedPayload } from '@archie/api/ltv-api/data-transfer-objects';

@Controller('v1/collateral')
export class CollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getCollateral(@Req() request): Promise<GetCollateralResponse[]> {
    return this.collateralService.getUserCollateral(request.user.sub);
  }

  @Get('value')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserCollateralValue(
    @Req() request,
  ): Promise<GetCollateralValueResponse[]> {
    return this.collateralService.getUserCollateralValue(request.user.sub);
  }

  @Get('value/total')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserTotalCollateralValue(
    @Req() request,
  ): Promise<GetTotalCollateralValueResponse> {
    return this.collateralService.getUserTotalCollateralValue(request.user.sub);
  }
}

@Controller()
export class CollateralQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-collateral-user-vault`;

  constructor(private collateralService: CollateralService) {}

  @Subscribe(
    COLLATERAL_DEPOSITED_TOPIC,
    CollateralQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralDepositedHandler(
    payload: CollateralDepositedPayload,
  ): Promise<void> {
    await this.collateralService.createDeposit(payload);
  }

  @Subscribe(
    MARGIN_CALL_COMPLETED_TOPIC,
    CollateralQueueController.CONTROLLER_QUEUE_NAME,
  )
  async marginCallCompletedLiquidationHandler(
    payload: MarginCallCompletedPayload,
  ): Promise<void> {
    await this.collateralService.liquidateAssets(payload);
  }

  @Subscribe(
    INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
    CollateralQueueController.CONTROLLER_QUEUE_NAME,
  )
  async internalCollateralTransactionCompletedTopic(
    payload: InternalCollateralTransactionCompletedPayload,
  ): Promise<void> {
    Logger.log(
      'INTERNAL_COLLATERAL_TRANSACTION_COMPLETED event received',
      payload,
    );

    await this.collateralService.handleInternalTransactionCompletedEvent(
      payload,
    );
  }

  @RequestHandler(
    GET_COLLATERAL_RPC,
    CollateralQueueController.CONTROLLER_QUEUE_NAME,
  )
  async getCollateral(
    payload: GetCollateralPayload,
  ): Promise<RPCResponse<GetCollateralResponse[]>> {
    try {
      const data = await this.collateralService.getUserCollateral(
        payload.userId,
      );

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

  @RequestHandler(
    GET_COLLATERAL_VALUE_RPC,
    CollateralQueueController.CONTROLLER_QUEUE_NAME,
  )
  async getCollateralValue(
    payload: GetCollateralValuePayload,
  ): Promise<RPCResponse<GetCollateralValueResponse[]>> {
    try {
      const data = await this.collateralService.getUserCollateralValue(
        payload.userId,
      );

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
