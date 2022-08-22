import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@archie/api/utils/auth0';
import { PaymentsService } from './payments.service';
import { BorrowerNotFoundError } from '../borrower.errors';
import { GetPaymentsQueryDto } from './payments.dto';

@Controller('v1/loan_payments')
export class PaymentsController {
  constructor(private transactionsService: PaymentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError])
  async getPayments(
    @Req() request,
    @Query() query: GetPaymentsQueryDto,
  ): Promise<any> {
    return this.transactionsService.getPayments(request.user.sub, query);
  }
}
