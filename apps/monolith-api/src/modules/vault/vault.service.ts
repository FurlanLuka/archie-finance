import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { base64decode, base64encode } from 'nodejs-base64';
import { ConfigService } from '@archie-microservices/config';
import { VaultDecryptionData, VaultEncryptionData } from './vault.interfaces';
import { ConfigVariables } from '../../interfaces';

@Injectable()
export class VaultService {
  private vaultAccessToken: string;

  constructor(private configService: ConfigService) {}

  private async authenticateVault(): Promise<string> {
    try {
      // eslint-disable-next-line
      const tokenData: AxiosResponse<any> = await axios.post(
        `${this.configService.get(
          ConfigVariables.VAULT_PRIVATE_ADDRESS,
        )}/v1/auth/userpass/login/${this.configService.get(
          ConfigVariables.VAULT_USERNAME,
        )}`,
        {
          password: this.configService.get(ConfigVariables.VAULT_PASSWORD),
        },
        {
          headers: {
            'X-Vault-Namespace': this.configService.get(
              ConfigVariables.VAULT_NAMESPACE,
            ),
          },
        },
      );

      return tokenData.data.auth.client_token;
    } catch (error) {
      Logger.error({
        code: 'VAULT_AUTHENTICATION_ERROR',
        metadata: {
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException();
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
          `${this.configService.get(
            ConfigVariables.VAULT_PRIVATE_ADDRESS,
          )}/v1/transit/encrypt/backend-encryption-key`,
          {
            batch_input: strings.map((string: string) => {
              return {
                plaintext: base64encode(string),
              };
            }),
          },
          {
            headers: {
              'X-Vault-Token': await this.getVaultToken(),
              'X-Vault-Namespace': this.configService.get(
                ConfigVariables.VAULT_NAMESPACE,
              ),
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
        },
      });

      if (
        error.code !== undefined &&
        (error.code === '401' || error.code === '403')
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
          `${this.configService.get(
            ConfigVariables.VAULT_PRIVATE_ADDRESS,
          )}/v1/transit/decrypt/backend-encryption-key`,
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
              'X-Vault-Namespace': this.configService.get(
                ConfigVariables.VAULT_NAMESPACE,
              ),
            },
          },
        );

      return response.data.data.batch_results.map((result) =>
        base64decode(result.plaintext),
      );
    } catch (err) {
      const error: AxiosError = err;

      Logger.error({
        code: 'DECRYPT_STRINGS_ERROR',
        metadata: {
          error: JSON.stringify(error),
        },
      });

      if (
        error.code !== undefined &&
        (error.code === '401' || error.code === '403')
      ) {
        this.vaultAccessToken = undefined;

        return this.decryptStrings(strings);
      }

      throw error;
    }
  }
}
