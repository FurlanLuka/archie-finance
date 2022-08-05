import { AuthGuard } from '@archie/api/utils/auth0';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  GetAccountsResponse,
  GetLinkTokenResponse,
  SetAccessTokenBody,
} from './plaid.interfaces';

@Controller('v1/plaid')
export class PlaidController {
  constructor(private plaidService: PlaidService) {}

  @Get('link_token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getLinkToken(@Request() req): Promise<GetLinkTokenResponse> {
    return this.plaidService.getLinkToken(req.user.sub);
  }

  @Post('set_access_token')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  public async setAccessToken(
    @Request() req,
    @Body() body: SetAccessTokenBody,
  ): Promise<void> {
    return this.plaidService.setAccessToken(req.user.sub, body.publicToken);
  }

  @Get('accounts')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getAccounts(@Request() req): Promise<GetAccountsResponse> {
    return this.plaidService.getUserAccounts(req.user.sub);
  }
}
