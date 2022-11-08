import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { MarginService } from './margin.service';
import { MarginCallDto, MarginCallQueryDto } from '@archie/api/ltv-api/data-transfer-objects';

@Controller('v1/margin_calls')
export class MarginController {
  constructor(private marginService: MarginService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([])
  async getMarginCalls(@Request() req, @Query() query: MarginCallQueryDto): Promise<MarginCallDto[]> {
    return this.marginService.getMarginCalls(req.user.sub, query);
  }
}
