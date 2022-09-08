import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { Statement } from '../api/peach_api.interfaces';
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
import { LoanStatementsService } from './statements.service';

@Controller('v1/loan_statements')
export class LoanStatementsController {
  constructor(private loanStatementsService: LoanStatementsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([
    NotFoundException,
    BorrowerNotFoundError,
    CreditLineNotFoundError,
  ])
  async getLoanStatements(@Req() req): Promise<Statement[]> {
    return this.loanStatementsService.getLoanStatements(req.user.sub);
  }
}
