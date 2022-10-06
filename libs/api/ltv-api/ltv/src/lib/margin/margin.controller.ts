import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { MarginService } from './margin.service';
import { MarginCallQueryDto, MarginCallsDto } from './margin.dto';

@Controller('v1/margin_calls')
export class MarginController {
  constructor(private marginService: MarginService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([])
  async getMarginCalls(
    @Request() req,
    @Query() query: MarginCallQueryDto,
  ): Promise<MarginCallsDto[]> {
    return this.marginService.getMarginCalls(req.user.sub, query);
  }
}
