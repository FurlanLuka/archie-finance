import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/plaid')
export class PlaidController {
  constructor(private plaidService: PlaidService) {}

  @Get('hello')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async helloPlaid(@Request() req): Promise<string> {
    return this.plaidService.helloPlaid(req.user.sub);
  }
}
