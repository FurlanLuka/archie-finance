import { AuthGuard } from '@archie/api/utils/auth0';
import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RizeService } from './rize.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  CustomerAlreadyExists,
  ActiveCustomerDoesNotExist,
  DebitCardDoesNotExist,
} from './rize.errors';
import {
  CardResponseDto,
  GetTransactionsQueryDto,
  TransactionResponseDto,
} from './rize.dto';
import { Subscribe } from '@archie/api/utils/queue';
import { SERVICE_QUEUE_NAME } from '@archie/api/credit-api/constants';
import {
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/margin-api/constants';
import {
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/margin-api/data-transfer-objects';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/rize/users')
export class RizeController {
  constructor(private rizeService: RizeService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([CustomerAlreadyExists])
  public async createUser(@Request() req): Promise<void> {
    return this.rizeService.createUser(
      req.user.sub,
      req.headers['x-forwarded-for'],
    );
  }

  @Get('cards/credit')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([DebitCardDoesNotExist, ActiveCustomerDoesNotExist])
  public async getVirtualCard(@Request() req): Promise<CardResponseDto> {
    return this.rizeService.getVirtualCard(req.user.sub);
  }

  @Get('transactions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([ActiveCustomerDoesNotExist])
  public async getTransactions(
    @Request() req,
    @Query() query: GetTransactionsQueryDto,
  ): Promise<TransactionResponseDto> {
    return this.rizeService.getTransactions(
      req.user.sub,
      query.page,
      query.limit,
    );
  }
}

@Controller()
export class RizeQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-rize`;

  constructor(private rizeService: RizeService) {}

  @Subscribe(
    MARGIN_CALL_STARTED_TOPIC,
    RizeQueueController.CONTROLLER_QUEUE_NAME,
  )
  async marginCallStartedHandler(
    payload: MarginCallStartedPayload,
  ): Promise<void> {
    await this.rizeService.lockCard(payload.userId);
  }

  @Subscribe(
    MARGIN_CALL_COMPLETED_TOPIC,
    RizeQueueController.CONTROLLER_QUEUE_NAME,
  )
  async marginCallCompletedHandler(
    payload: MarginCallCompletedPayload,
  ): Promise<void> {
    await this.rizeService.unlockCard(payload.userId);
  }

  @Subscribe(
    CREDIT_BALANCE_UPDATED_TOPIC,
    RizeQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitDecreasedHandler(
    payload: CreditBalanceUpdatedPayload,
  ): Promise<void> {
    await this.rizeService.updateAvailableCredit(payload);
  }
}
