import {
  GET_LOAN_BALANCES_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/peach-api/constants';
import {
  GetLoanBalancesPayload,
  GetLoanBalancesResponse,
} from '@archie/api/peach-api/data-transfer-objects/types';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { RequestHandler } from '@archie/api/utils/queue/decorators/request_handler';
import { RPCResponse, RPCResponseType } from '@archie/api/utils/queue';
import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
} from '../borrower.errors';
import { LoanBalancesService } from './loan-balances.service';
import { LoanBalancesDto } from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/loan_balances')
export class LoanBalancesController {
  constructor(private loanBalancesService: LoanBalancesService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    NotFoundException,
    BorrowerNotFoundError,
    CreditLineNotFoundError,
  ])
  async getLoanBalances(@Req() req): Promise<LoanBalancesDto> {
    return this.loanBalancesService.getLoanBalances(req.user.sub);
  }
}

@Controller()
export class LoanBalancesQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-loan-balances`;

  constructor(private loanBalancesService: LoanBalancesService) {}

  @RequestHandler(
    GET_LOAN_BALANCES_RPC,
    LoanBalancesQueueController.CONTROLLER_QUEUE_NAME,
  )
  async getLoanBalances(
    payload: GetLoanBalancesPayload,
  ): Promise<RPCResponse<GetLoanBalancesResponse>> {
    try {
      const data = await this.loanBalancesService.getLatestLoanBalance(
        payload.userId,
      );

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message ?? 'INTERNAL_SERVER_EXCEPTION',
      };
    }
  }
}
