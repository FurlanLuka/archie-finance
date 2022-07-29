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
  CollateralWithdrawCompletedDto,
  CollateralWithdrawCreateDto,
  CollateralWithdrawTransactionCreatedDto,
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

@Controller('v1/collateral/withdraw')
export class CollateralWithdrawalController {
  constructor(
    private collateralWithdrawalService: CollateralWithdrawalService,
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
  constructor(
    private collateralWithdrawalService: CollateralWithdrawalService,
  ) {}

  @Subscribe(COLLATERAL_WITHDRAW_COMPLETED_TOPIC, SERVICE_QUEUE_NAME)
  async collateralWithdrawCompleteHandler(
    payload: CollateralWithdrawCompletedDto,
  ): Promise<void> {
    await this.collateralWithdrawalService.handleWithdrawalComplete(payload);
  }
  @Subscribe(COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC, SERVICE_QUEUE_NAME)
  async collateralWithdrawTransactionCreatedHandler(
    payload: CollateralWithdrawTransactionCreatedDto,
  ): Promise<void> {
    await this.collateralWithdrawalService.handleWithdrawalTransactionCreated(
      payload,
    );
  }
}