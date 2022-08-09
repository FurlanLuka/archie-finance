import { Injectable, Logger } from '@nestjs/common';
import { PlaidApiService } from './api/plaid-api.service';
import {
  AccountResponse,
  GetAccountsResponse,
  GetLinkableAccountsResponse,
  GetLinkTokenResponse,
  SetAccessTokenResponse,
} from './plaid.interfaces';
import { CryptoService } from '@archie/api/utils/crypto';
import { PlaidAccess } from './plaid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicTokenExpiredException } from './plaid.errors';
import { AccountBase } from 'plaid';

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
  ): Promise<SetAccessTokenResponse> {
    try {
      const { accessToken } = await this.plaidApiService.exchangePublicToken(
        publicToken,
      );

      const encryptedAccessToken: string =
        this.cryptoService.encrypt(accessToken);

      const { itemId } = await this.plaidAccessRepository.save({
        userId,
        accessToken: encryptedAccessToken,
        accountId: null,
      });

      return { itemId };
    } catch (err) {
      if (err?.response?.data?.error_code === 'INVALID_PUBLIC_TOKEN') {
        throw new PublicTokenExpiredException();
      }

      throw err;
    }
  }
  private transformAccounts(accountsBase: AccountBase[]): AccountResponse[] {
    const accountsResponse: AccountResponse[] = accountsBase.map((account) => ({
      id: account.account_id,
      name: account.name,
      mask: account.mask,
      availableBalance: account.balances.available,
      currencyISO: account.balances.iso_currency_code,
      subtype: account.subtype,
    }));

    return accountsResponse;
  }

  public async getLinkableAccounts(
    userId: string,
    itemId: string,
  ): Promise<GetLinkableAccountsResponse> {
    const accessItem = await this.plaidAccessRepository.findOne({
      where: { itemId, userId, accountId: null },
      select: ['accessToken'],
    });

    const decryptedAccessToken: string = this.cryptoService.decrypt(
      accessItem.accessToken,
    );

    const itemAccounts = await this.plaidApiService.getAccountsForItem(
      decryptedAccessToken,
    );

    return this.transformAccounts(itemAccounts);
  }

  public async getConnectedUserAccounts(
    userId: string,
  ): Promise<GetAccountsResponse> {
    const accessItems = await this.plaidAccessRepository.find({
      where: { userId },
      select: ['accessToken', 'accountId'],
    });

    const allAccounts = await Promise.all(
      accessItems
        .filter((a) => a.accountId !== null)
        .map(async (item) => {
          const decryptedAccessToken: string = this.cryptoService.decrypt(
            item.accessToken,
          );

          const itemAccounts = await this.plaidApiService.getAccountsForItem(
            decryptedAccessToken,
          );

          const activeAccounts = itemAccounts.filter(
            (a) => a.account_id === item.accountId,
          );

          return this.transformAccounts(activeAccounts);
        }),
    );

    return allAccounts.flat(1);
  }

  public async removeAccount(userId: string, accountId: string): Promise<void> {
    const accessItem = await this.plaidAccessRepository.findOneOrFail({
      where: {
        accountId,
        userId,
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
