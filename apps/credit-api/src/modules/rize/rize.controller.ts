import { AuthGuard } from '@archie-microservices/auth0';
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
import { ApiErrorResponse } from '@archie-microservices/openapi';
import {
  CustomerAlreadyExists,
  ActiveCustomerDoesNotExist,
  DebitCardAlreadyExists,
  DebitCardDoesNotExist,
} from './rize.errors';
import {
  GetTransactionsQueryDto,
  MarginCallCompletedDto,
  MarginCallStartedDto,
  TransactionResponseDto,
} from './rize.dto';
import { Subscribe } from '@archie/api/utils/queue';
import {
  COLLATERAL_DEPOSITED_EXCHANGE,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import { CreateDepositDto } from '../collateral/collateral.dto';

@Controller('v1/rize')
export class RizeController {
  constructor(private rizeService: RizeService) {}

  @Post('users')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([CustomerAlreadyExists])
  public async createUser(@Request() req): Promise<void> {
    // TODO: remove log
    console.log(req.headers['x-forwarded-for']);

    return this.rizeService.createUser(
      req.user.sub,
      req.headers['x-forwarded-for'] ?? '123.56.3.12', //TODO: remove optional,
    );
  }

  @Post('users/cards')
  // @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([ActiveCustomerDoesNotExist, DebitCardAlreadyExists])
  public async createCard(@Request() req): Promise<void> {
    return this.rizeService.createCard('req.user.sub');
  }

  @Get('users/cards/image')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([DebitCardDoesNotExist])
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
  ): Promise<TransactionResponseDto[]> {
    return this.rizeService.getTransactions(
      req.user.sub,
      query.page,
      query.limit,
    );
  }
}

export class RizeQueueController {
  constructor(private rizeService: RizeService) {}

  @Subscribe(MARGIN_CALL_STARTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallStartedHandler(payload: MarginCallStartedDto): Promise<void> {
    await this.rizeService.lockCard(payload.userId);
  }

  @Subscribe(MARGIN_CALL_COMPLETED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallCompletedHandler(
    payload: MarginCallCompletedDto,
  ): Promise<void> {
    await this.rizeService.unlockCard(payload.userId);
  }
}
