import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
} from '../borrower.errors';
import { ObligationsService } from './obligations.service';
import { ObligationsResponseDto } from '@archie/api/peach-api/data-transfer-objects';

@Controller('v1/loan_obligations')
export class ObligationsController {
  constructor(private obligationsService: ObligationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getCreditObligations(@Req() request): Promise<ObligationsResponseDto> {
    return this.obligationsService.getObligations(request.user.sub);
  }
}
