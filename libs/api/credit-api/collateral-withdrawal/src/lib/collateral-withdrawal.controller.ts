import { AuthGuard } from '@archie/api/utils/auth0';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CollateralWithdrawCreateDto,
  GetCollateralWithdrawalResponse,
  GetUserMaxWithdrawalAmountResponse,
} from './collateral-withdrawal.interfaces';
import { CollateralWithdrawalService } from './collateral-withdrawal.service';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_WITHDRAW_COMPLETED_TOPIC,
  COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import {
  CollateralWithdrawCompletedPayload,
  CollateralWithdrawTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { CollateralNotFoundError } from './collateral-withdrawal.errors';

@Controller('v1/collateral/withdraw')
export class CollateralWithdrawalController {
  constructor(
    private collateralWithdrawalService: CollateralWithdrawalService,
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CollateralNotFoundError])
  async withdrawUserCollateral(
    @Req() request,
    @Body() body: CollateralWithdrawCreateDto,
  ): Promise<GetCollateralWithdrawalResponse> {
    return this.collateralWithdrawalService.withdrawUserCollateral(
      request.user.sub,
      body.asset,
      body.withdrawalAmount,
      body.destinationAddress,
    );
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserWithdrawals(
    @Req() request,
  ): Promise<GetCollateralWithdrawalResponse[]> {
    return this.collateralWithdrawalService.getUserWithdrawals(
      request.user.sub,
    );
  }

  @Get('/:asset/max_amount')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserMaxWithdrawalAmount(
    @Req() request,
    @Param('asset') asset: string,
  ): Promise<GetUserMaxWithdrawalAmountResponse> {
    return this.collateralWithdrawalService.getUserMaxWithdrawalAmount(
      request.user.sub,
      asset,
    );
  }
}

@Controller()
export class CollateralWithdrawalQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-collateral-withdrawal`;

  constructor(
    private collateralWithdrawalService: CollateralWithdrawalService,
  ) {}

  @Subscribe(
    COLLATERAL_WITHDRAW_COMPLETED_TOPIC,
    CollateralWithdrawalQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawCompleteHandler(
    payload: CollateralWithdrawCompletedPayload,
  ): Promise<void> {
    await this.collateralWithdrawalService.handleWithdrawalComplete(payload);
  }
  @Subscribe(
    COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC,
    CollateralWithdrawalQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralWithdrawTransactionCreatedHandler(
    payload: CollateralWithdrawTransactionCreatedPayload,
  ): Promise<void> {
    await this.collateralWithdrawalService.handleWithdrawalTransactionCreated(
      payload,
    );
  }
}
