import { Injectable } from '@nestjs/common';
import { PlaidLinkToken } from '@archie/api/credit-api/data-transfer-objects/types';
import { PlaidApiService } from './api/plaid-api.service';

@Injectable()
export class PlaidService {
  constructor(private plaidApiService: PlaidApiService) {}

  public async createLinkToken(userId: string): Promise<PlaidLinkToken> {
    const token = await this.plaidApiService.createLinkToken(userId);

    return { token: token.link_token };
  }
}
