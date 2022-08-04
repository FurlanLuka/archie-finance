import { Injectable } from '@nestjs/common';
import { PlaidApiService } from './api/plaid-api.service';
import { GetLinkTokenResponse } from './plaid.interfaces';

@Injectable()
export class PlaidService {
  constructor(private plaidApiService: PlaidApiService) {}

  public async getLinkToken(userId: string): Promise<GetLinkTokenResponse> {
    const token = await this.plaidApiService.createLinkToken(userId);

    return { token: token.link_token };
  }
}
