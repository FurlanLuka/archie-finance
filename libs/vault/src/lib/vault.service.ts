import {
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  VaultConfig,
  VaultDecryptionData,
  VaultEncryptionData,
} from './vault.interfaces';
import { CryptoService } from '@archie/api/utils/crypto';
import { VaultAuthenticationInternalError } from './vault.errors';

@Injectable()
export class VaultService {
  private vaultAccessToken: string;

  constructor(
    @Inject('VAULT_CONFIG') private vaultConfig: VaultConfig,
    private cryptoService: CryptoService,
  ) {}

  private async authenticateVault(): Promise<string> {
    try {
      // eslint-disable-next-line
      const tokenData: AxiosResponse<any> = await axios.post(
        `${this.vaultConfig.VAULT_PRIVATE_ADDRESS}/v1/auth/userpass/login/${this.vaultConfig.VAULT_USERNAME}`,
        {
          password: this.vaultConfig.VAULT_PASSWORD,
        },
        {
          headers: {
            'X-Vault-Namespace': this.vaultConfig.VAULT_NAMESPACE,
          },
        },
      );

      return tokenData.data.auth.client_token;
    } catch (err) {
      const error: AxiosError = err;

      throw new VaultAuthenticationInternalError({
        error: error.toJSON(),
        response: error.response.data,
      });
    }
  }

  public async getVaultToken(force = false): Promise<string> {
    if (this.vaultAccessToken === undefined || force) {
      this.vaultAccessToken = await this.authenticateVault();

      return this.vaultAccessToken;
    }

    return this.vaultAccessToken;
  }

  public async encryptStrings(strings: string[]): Promise<string[]> {
    try {
      const response: AxiosResponse<VaultEncryptionData> =
        await axios.post<VaultEncryptionData>(
          `${this.vaultConfig.VAULT_PRIVATE_ADDRESS}/v1/transit/encrypt/backend-encryption-key`,
          {
            batch_input: strings.map((string: string) => {
              return {
                plaintext: this.cryptoService.base64encode(string),
              };
            }),
          },
          {
            headers: {
              'X-Vault-Token': await this.getVaultToken(),
              'X-Vault-Namespace': this.vaultConfig.VAULT_NAMESPACE,
            },
          },
        );

      return response.data.data.batch_results.map(
        (result) => result.ciphertext,
      );
    } catch (err) {
      const error: AxiosError = err;

      Logger.error({
        code: 'ENCRYPT_STRINGS_ERROR',
        metadata: {
          error: JSON.stringify(error),
          response: error.response.data,
        },
      });

      if (
        error.status !== undefined &&
        (error.status === '401' || error.status === '403')
      ) {
        this.vaultAccessToken = undefined;

        return this.encryptStrings(strings);
      }

      throw error;
    }
  }

  public async decryptStrings(strings: string[]): Promise<string[]> {
    try {
      const response: AxiosResponse<VaultDecryptionData> =
        await axios.post<VaultDecryptionData>(
          `${this.vaultConfig.VAULT_PRIVATE_ADDRESS}/v1/transit/decrypt/backend-encryption-key`,
          {
            batch_input: strings.map((string: string) => {
              return {
                ciphertext: string,
              };
            }),
          },
          {
            headers: {
              'X-Vault-Token': await this.getVaultToken(),
              'X-Vault-Namespace': this.vaultConfig.VAULT_NAMESPACE,
            },
          },
        );

      return response.data.data.batch_results.map((result) =>
        this.cryptoService.base64decode(result.plaintext),
      );
    } catch (err) {
      const error: AxiosError = err;

      Logger.error({
        code: 'DECRYPT_STRINGS_ERROR',
        metadata: {
          error: error.toJSON(),
          response: error.response.data,
        },
      });

      if (
        error.status !== undefined &&
        (error.status === '401' || error.status === '403')
      ) {
        this.vaultAccessToken = undefined;

        return this.decryptStrings(strings);
      }

      throw error;
    }
  }
}
