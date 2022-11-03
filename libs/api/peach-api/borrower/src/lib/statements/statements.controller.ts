import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { StatementDto } from '@archie/api/peach-api/data-transfer-objects';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BorrowerNotFoundError, CreditLineNotFoundError } from '../borrower.errors';
import { LoanStatementsService } from './statements.service';
import { LoanDocumentDto } from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/loan_statements')
export class LoanStatementsController {
  constructor(private loanStatementsService: LoanStatementsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getLoanStatements(@Req() req): Promise<StatementDto[]> {
    return this.loanStatementsService.getLoanStatements(req.user.sub);
  }

  @Get('/:documentId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getLoanDocumentUrl(@Req() req, @Param('documentId') documentId: string): Promise<LoanDocumentDto> {
    return this.loanStatementsService.getLoanDocumentUrl(req.user.sub, documentId);
  }
}
