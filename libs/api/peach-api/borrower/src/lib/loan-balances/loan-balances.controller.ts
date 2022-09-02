import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetLoanBalancesDto } from './loan-balances.dto';
import { LoanBalancesService } from './loan-balances.service';

@Controller('v1/loan_balances')
export class LoanBalancesController {
  constructor(private loanBalancesService: LoanBalancesService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getLoanBalances(@Req() req): Promise<GetLoanBalancesDto> {
    return this.loanBalancesService.getLoanBalances(req.user.sub);
  }
}
