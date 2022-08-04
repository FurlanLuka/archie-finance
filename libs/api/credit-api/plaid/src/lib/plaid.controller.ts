import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetLinkTokenResponse } from './plaid.interfaces';

@Controller('v1/plaid')
export class PlaidController {
  constructor(private plaidService: PlaidService) {}

  @Get('link_token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getLinkToken(@Request() req): Promise<GetLinkTokenResponse> {
    return this.plaidService.getLinkToken(req.user.sub);
  }
}
