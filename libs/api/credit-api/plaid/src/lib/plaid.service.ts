import { Injectable, Logger } from '@nestjs/common';
import { PlaidApiService } from './api/plaid-api.service';
import {
  AccountResponse,
  GetAccountsResponse,
  GetLinkTokenResponse,
} from './plaid.interfaces';
import { CryptoService } from '@archie/api/utils/crypto';
import { PlaidAccess } from './plaid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicTokenExpiredException } from './plaid.errors';

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
    try {
      const { accessToken, itemId } =
        await this.plaidApiService.exchangePublicToken(publicToken);

      const encryptedAccessToken: string =
        this.cryptoService.encrypt(accessToken);

      await this.plaidAccessRepository.save({
        userId,
        accessToken: encryptedAccessToken,
        itemId,
      });
    } catch (err) {
      if (err?.response?.data?.error_code === 'INVALID_PUBLIC_TOKEN') {
        throw new PublicTokenExpiredException();
      }

      throw err;
    }
  }

  public async getUserAccounts(userId: string): Promise<GetAccountsResponse> {
    const accessItems = await this.plaidAccessRepository.find({
      where: { userId },
      select: ['accessToken', 'itemId'],
    });

    const allAccounts = await Promise.all(
      accessItems.map(async (item) => {
        const decryptedAccessToken: string = this.cryptoService.decrypt(
          item.accessToken,
        );

        const itemAccounts = await this.plaidApiService.getAccountsForItem(
          decryptedAccessToken,
        );
        // console.log('olakawnts', itemAccounts);

        // TODO check if we need type or subtype
        const accountsResponse: AccountResponse[] = itemAccounts.map(
          (account) => ({
            id: account.account_id,
            name: account.name,
            mask: account.mask,
            availableBalance: account.balances.available,
            currencyISO: account.balances.iso_currency_code,
            subtype: account.subtype,
          }),
        );

        return accountsResponse;
      }),
    );

    return allAccounts.flat(1);
  }

  public async removeAccount(userId: string, itemId: string): Promise<void> {
    console.log('evo nas', { userId, itemId });
    const accessItem = await this.plaidAccessRepository.findOneOrFail({
      where: {
        userId,
        itemId,
      },
      select: ['accessToken'],
    });

    const decryptedAccessToken: string = this.cryptoService.decrypt(
      accessItem.accessToken,
    );

    await this.plaidApiService.unlinkAccount(decryptedAccessToken);
    await this.plaidAccessRepository.delete(accessItem);
  }
}
