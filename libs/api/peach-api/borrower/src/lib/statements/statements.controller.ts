import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { Statement } from '../api/peach_api.interfaces';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
} from '../borrower.errors';
import { LoanStatementsService } from './statements.service';
import { GetLoanDocumentDto } from './statements.dto';

@Controller('v1/loan_statements')
export class LoanStatementsController {
  constructor(private loanStatementsService: LoanStatementsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getLoanStatements(@Req() req): Promise<Statement[]> {
    return this.loanStatementsService.getLoanStatements(req.user.sub);
  }

  @Get('/:documentId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getLoanDocumentUrl(
    @Req() req,
    @Param('documentId') documentId: string,
  ): Promise<GetLoanDocumentDto> {
    return this.loanStatementsService.getLoanDocumentUrl(
      req.user.sub,
      documentId,
    );
  }
}
