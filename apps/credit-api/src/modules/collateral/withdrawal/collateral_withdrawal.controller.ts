import { AuthGuard } from '@archie-microservices/auth0';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CollateralWithdrawCompletedDto,
  CollateralWithdrawCreateDto,
  CollateralWithdrawTransactionCreatedDto,
} from './collateral_withdrawal.dto';
import { CollateralWithdrawalService } from './collateral_withdrawal.service';
import {
  GetCollateralWithdrawal,
  GetUserWithdrawals,
} from '@archie-microservices/api-interfaces/collateral';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
  COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
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
  ): Promise<GetCollateralWithdrawal> {
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
  async getUserWithdrawals(@Req() request): Promise<GetUserWithdrawals> {
    return this.collateralWithdrawalService.getUserWithdrawals(
      request.user.sub,
    );
  }
}

@Controller()
export class CollateralWithdrawalQueueController {
  constructor(
    private collateralWithdrawalService: CollateralWithdrawalService,
  ) {}

  @Subscribe(COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE, SERVICE_QUEUE_NAME)
  async collateralWithdrawCompleteHandler(
    payload: CollateralWithdrawCompletedDto,
  ): Promise<void> {
    await this.collateralWithdrawalService.handleWithdrawalComplete(payload);
  }
  @Subscribe(
    COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
    SERVICE_QUEUE_NAME,
  )
  async collateralWithdrawTransactionCreatedHandler(
    payload: CollateralWithdrawTransactionCreatedDto,
  ): Promise<void> {
    await this.collateralWithdrawalService.handleWithdrawalTransactionCreated(
      payload,
    );
  }
}
