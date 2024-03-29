import { Injectable } from '@nestjs/common';
import {
  CreateTransactionResponse,
  FireblocksSDK,
  PeerType,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import { ConfigVariables } from '@archie/api/fireblocks-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import { CryptoService } from '@archie/api/utils/crypto';
import {
  CreateTransactionError,
  CreateVaultAccountError,
  CreateVaultAssetError,
} from './fireblocks_api.errors';

@Injectable()
export class FireblocksApiService {
  private fireblocksClient: FireblocksSDK;

  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {
    this.fireblocksClient = new FireblocksSDK(
      cryptoService.base64decode(
        this.configService.get(ConfigVariables.FIREBLOCKS_PRIVATE_KEY),
      ),
      this.configService.get(ConfigVariables.FIREBLOCKS_API_KEY),
    );
  }

  public async createVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const hashedUserId: string = this.cryptoService.sha256(userId);
    try {
      return await this.fireblocksClient.createVaultAccount(
        hashedUserId,
        false,
        hashedUserId,
        true,
      );
    } catch (error) {
      throw new CreateVaultAccountError({
        userId,
      });
    }
  }

  public async getVaultAccount(
    vaultAccountId: string,
  ): Promise<VaultAccountResponse> {
    return this.fireblocksClient.getVaultAccountById(vaultAccountId);
  }

  public async createVaultAsset(
    vaultAccountId: string,
    asset: string,
  ): Promise<VaultAssetResponse> {
    try {
      return await this.fireblocksClient.createVaultAsset(
        vaultAccountId,
        asset,
      );
    } catch (error) {
      throw new CreateVaultAssetError({
        vaultAccountId,
        asset,
      });
    }
  }

  public async createOutboundTransaction(
    assetId: string,
    amount: string,
    destinationAddress: string,
    internalTransactionId: string,
    vaultAccountId: string,
  ): Promise<CreateTransactionResponse> {
    try {
      const createTransactionResponse: CreateTransactionResponse =
        await this.fireblocksClient.createTransaction({
          assetId,
          amount,
          source: {
            type: PeerType.VAULT_ACCOUNT,
            id: vaultAccountId,
          },
          destination: {
            type: PeerType.ONE_TIME_ADDRESS,
            oneTimeAddress: {
              address: destinationAddress,
            },
          },
          externalTxId: internalTransactionId,
        });

      if (
        ['REJECTED', 'BLOCKED', 'FAILED', 'CANCELLED'].includes(
          createTransactionResponse.status,
        )
      ) {
        throw new Error('Transaction rejected');
      }

      return createTransactionResponse;
    } catch (error) {
      throw new CreateTransactionError({
        assetId,
        amount,
        destinationAddress,
        internalTransactionId,
        vaultAccountId,
      });
    }
  }

  public async createInternalTransaction(
    assetId: string,
    amount: string,
    destinationVaultId: string,
    internalTransactionId: string,
    vaultAccountId: string,
  ): Promise<CreateTransactionResponse> {
    try {
      const createTransactionResponse: CreateTransactionResponse =
        await this.fireblocksClient.createTransaction({
          assetId,
          amount,
          source: {
            type: PeerType.VAULT_ACCOUNT,
            id: vaultAccountId,
          },
          destination: {
            type: PeerType.VAULT_ACCOUNT,
            id: destinationVaultId,
          },
          externalTxId: internalTransactionId,
        });

      if (
        ['REJECTED', 'BLOCKED', 'FAILED', 'CANCELLED'].includes(
          createTransactionResponse.status,
        )
      ) {
        throw new Error('Transaction rejected');
      }

      return createTransactionResponse;
    } catch (error) {
      throw new CreateTransactionError({
        assetId,
        amount,
        destinationVaultId,
        internalTransactionId,
        vaultAccountId,
      });
    }
  }
}
