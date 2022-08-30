import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  BorrowerNotFoundError,
  CreditLineNotFoundError,
} from '../borrower.errors';
import { InterestsService } from './interests.service';
import { InterestsDto } from './interests.dto';

@Controller('v1/loan_interests')
export class InterestsController {
  constructor(private interestsService: InterestsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BorrowerNotFoundError, CreditLineNotFoundError])
  async getInterests(@Req() request): Promise<InterestsDto> {
    return this.interestsService.getInterests(request.user.sub);
  }
}
