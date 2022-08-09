import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  GetAccountsResponse,
  GetLinkableAccountsResponse,
  GetLinkTokenResponse,
  SetAccessTokenBody,
  SetAccessTokenResponse,
} from './plaid.interfaces';
import { PublicTokenExpiredException } from './plaid.errors';

@Controller('v1/plaid')
export class PlaidController {
  constructor(private plaidService: PlaidService) {}

  @Post('link_tokens')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getLinkToken(@Request() req): Promise<GetLinkTokenResponse> {
    return this.plaidService.getLinkToken(req.user.sub);
  }

  @Post('access_tokens')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([PublicTokenExpiredException])
  public async setAccessToken(
    @Request() req,
    @Body() body: SetAccessTokenBody,
  ): Promise<SetAccessTokenResponse> {
    return this.plaidService.setAccessToken(req.user.sub, body.publicToken);
  }

  @Get('linkable_accounts/:itemId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getLinkableAccounts(
    @Request() req,
    @Param('itemId') itemId: string,
  ): Promise<GetLinkableAccountsResponse> {
    return this.plaidService.getLinkableAccounts(req.user.sub, itemId);
  }

  @Get('connected_accounts')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getConnectedAccounts(
    @Request() req,
  ): Promise<GetLinkableAccountsResponse> {
    return this.plaidService.getConnectedUserAccounts(req.user.sub);
  }

  @Delete('accounts/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async removeAccount(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.plaidService.removeAccount(req.user.sub, id);
  }
}
