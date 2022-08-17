import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PlaidApiService } from './api/plaid-api.service';
import {
  AccountResponse,
  ConnectAccountBody,
  GetAccountsResponse,
  GetLinkableAccountsResponse,
  GetLinkTokenResponse,
  SetAccessTokenResponse,
} from './plaid.interfaces';
import { CryptoService } from '@archie/api/utils/crypto';
import { PlaidAccess } from './plaid_access.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccessTokenUsedException,
  PublicTokenExpiredException,
} from './plaid.errors';
import { AccountBase } from 'plaid';

@Injectable()
export class PlaidService {
  constructor(
    @InjectRepository(PlaidAccess)
    private plaidAccessRepository: Repository<PlaidAccess>,
    private plaidApiService: PlaidApiService,
    private cryptoService: CryptoService,
  ) {}

  public async createLinkToken(userId: string): Promise<GetLinkTokenResponse> {
    const token = await this.plaidApiService.createLinkToken(userId);

    return { token: token.link_token };
  }

  public async setAccessToken(
    userId: string,
    publicToken: string,
  ): Promise<SetAccessTokenResponse> {
    try {
      const { accessToken, itemId } =
        await this.plaidApiService.exchangePublicToken(publicToken);

      const existingAccessItem = await this.plaidAccessRepository.findOne({
        where: { userId, itemId },
      });

      if (existingAccessItem) {
        Logger.error({
          code: 'ACCESS_TOKEN_USED',
        });

        throw new AccessTokenUsedException();
      }

      const encryptedAccessToken: string =
        this.cryptoService.encrypt(accessToken);

      await this.plaidAccessRepository.save({
        userId,
        itemId,
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
    const accessItem = await this.plaidAccessRepository.findOneOrFail({
      where: { itemId, userId, accountId: IsNull() },
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
      where: { userId, accountId: Not(IsNull()) },
      select: ['accessToken', 'accountId'],
    });

    const allAccounts = await Promise.all(
      accessItems.map(async (item) => {
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

    return allAccounts.flat();
  }

  public async connectAccount(
    userId: string,
    { itemId, accountId }: ConnectAccountBody,
  ): Promise<void> {
    await this.plaidAccessRepository.update(
      {
        itemId,
        userId,
        accountId: IsNull(),
      },
      {
        accountId,
      },
    );
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
