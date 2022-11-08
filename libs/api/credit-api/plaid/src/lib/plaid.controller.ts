import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PlaidLinkTokenDto } from '@archie/api/credit-api/data-transfer-objects';

@Controller('v1/plaid')
export class PlaidController {
  constructor(private plaidService: PlaidService) {}

  @Post('link_tokens')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async createLinkToken(@Request() req): Promise<PlaidLinkTokenDto> {
    return this.plaidService.createLinkToken(req.user.sub);
  }
}
