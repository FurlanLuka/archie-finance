import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LtvResponseDto } from '@archie/api/credit-api/margin';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LtvService } from './ltv.service';

@Controller('v1/ltvs/current')
export class LtvController {
  constructor(private ltvService: LtvService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getCurrentLtv(@Req() request): Promise<LtvResponseDto> {
    return this.ltvService.getCurrentLtv(request.user.sub);
  }
}
