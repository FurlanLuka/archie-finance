import { Injectable } from '@nestjs/common';
import { PlaidApiService } from './api/plaid-api.service';
import { GetLinkTokenResponse } from './plaid.interfaces';
import { CryptoService } from '@archie/api/utils/crypto';
import { PlaidAccess } from './plaid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlaidService {
  constructor(
    @InjectRepository(PlaidAccess)
    private plaidAccessRepository: Repository<PlaidAccess>,
    private plaidApiService: PlaidApiService,
    private cryptoService: CryptoService,
  ) {}

  public async getLinkToken(userId: string): Promise<GetLinkTokenResponse> {
    const token = await this.plaidApiService.createLinkToken(userId);

    return { token: token.link_token };
  }

  public async setAccessToken(
    userId: string,
    publicToken: string,
  ): Promise<void> {
    const { accessToken, itemId } =
      await this.plaidApiService.exchangePublicToken(publicToken);
    console.log('gotsa da akses!', accessToken);

    const encryptedAccessToken: string =
      this.cryptoService.encrypt(accessToken);

    await this.plaidAccessRepository.save({
      userId,
      accessToken: encryptedAccessToken,
      itemId,
    });
  }
}
