import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LtvService } from './ltv.service';
import { LtvDto } from './ltv.dto';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { CreditNotSetUpError } from '../lib.errors';

@Controller('v1/ltv')
export class LtvController {
  constructor(private ltvService: LtvService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([CreditNotSetUpError])
  async getCurrentLtv(@Req() request): Promise<LtvDto> {
    return this.ltvService.getCurrentLtv(request.user.sub);
  }
}
