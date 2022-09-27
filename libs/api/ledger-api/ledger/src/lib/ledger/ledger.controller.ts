import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { LedgerService } from './ledger.service';
import { Ledger } from '@archie/api/ledger-api/data-transfer-objects';

@Controller('v1/ledger')
export class LedgerController {
  constructor(private ledgerService: LedgerService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getLedger(@Req() request): Promise<Ledger> {
    return this.ledgerService.getLedger(request.user.sub);
  }
}
