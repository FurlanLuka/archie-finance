import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
} from '../borrower.errors';
import { InterestsService } from './interests.service';
import { LoanInterestsDto } from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/loan_interests')
export class InterestsController {
  constructor(private interestsService: InterestsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getInterests(@Req() request): Promise<LoanInterestsDto> {
    return this.interestsService.getInterests(request.user.sub);
  }
}
