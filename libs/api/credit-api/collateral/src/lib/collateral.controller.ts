import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import {
  CreateDepositDto,
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
  constructor(private collateralService: CollateralService) {}

  @Subscribe(COLLATERAL_DEPOSITED_TOPIC, SERVICE_QUEUE_NAME)
  async collateralDepositedHandler(payload: CreateDepositDto): Promise<void> {
    await this.collateralService.createDeposit(payload);
  }

  @RequestHandler(GET_COLLATERAL_RPC, SERVICE_QUEUE_NAME)
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

  @RequestHandler(GET_COLLATERAL_VALUE_RPC, SERVICE_QUEUE_NAME)
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
