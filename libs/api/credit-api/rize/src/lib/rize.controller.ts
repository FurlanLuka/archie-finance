import { AuthGuard } from '@archie/api/utils/auth0';
import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Response,
  Query,
} from '@nestjs/common';
import { RizeService } from './rize.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  CustomerAlreadyExists,
  ActiveCustomerDoesNotExist,
  DebitCardDoesNotExist,
} from './rize.errors';
import {
  CreditLimitDto,
  GetTransactionsQueryDto,
  MarginCallCompletedDto,
  MarginCallStartedDto,
  TransactionResponseDto,
} from './rize.dto';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';

@Controller('v1/rize')
export class RizeController {
  constructor(private rizeService: RizeService) {}

  @Post('users')
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

  @Get('users/cards/image')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([DebitCardDoesNotExist, ActiveCustomerDoesNotExist])
  @ApiOkResponse({
    status: 200,
    description: 'Debit card image',
  })
  public async getVirtualCard(@Request() req, @Response() res): Promise<void> {
    const virtualCard: string = await this.rizeService.getVirtualCard(
      req.user.sub,
    );

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(Buffer.from(virtualCard, 'base64'));
  }

  @Get('users/transactions')
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
  constructor(private rizeService: RizeService) {}

  @Subscribe(MARGIN_CALL_STARTED_TOPIC, SERVICE_QUEUE_NAME)
  async marginCallStartedHandler(payload: MarginCallStartedDto): Promise<void> {
    await this.rizeService.lockCard(payload.userId);
  }

  @Subscribe(MARGIN_CALL_COMPLETED_TOPIC, SERVICE_QUEUE_NAME)
  async marginCallCompletedHandler(
    payload: MarginCallCompletedDto,
  ): Promise<void> {
    await this.rizeService.unlockCard(payload.userId);
  }

  @Subscribe(CREDIT_LIMIT_DECREASED_TOPIC, SERVICE_QUEUE_NAME)
  async creditLimitDecreasedHandler(payload: CreditLimitDto): Promise<void> {
    await this.rizeService.decreaseCreditLimit(payload.userId, payload.amount);
  }

  @Subscribe(CREDIT_LIMIT_INCREASED_TOPIC, SERVICE_QUEUE_NAME)
  async creditLimitIncreasedHandler(payload: CreditLimitDto): Promise<void> {
    await this.rizeService.increaseCreditLimit(payload.userId, payload.amount);
  }
}
