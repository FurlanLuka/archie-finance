import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { CryptoConfig } from './crypto.interfaces';

@Injectable()
export class CryptoService {
  private privateKey: string | undefined;
  private publicKey: string | undefined;

  constructor(@Inject('CRYPTO_OPTIONS') cryptoConfig: CryptoConfig) {
    if (cryptoConfig.privateKey) {
      this.privateKey = this.base64decode(cryptoConfig.privateKey);
    }

    if (cryptoConfig.publicKey) {
      this.publicKey = this.base64decode(cryptoConfig.publicKey);
    }
  }

  public sha256(data: crypto.BinaryLike): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public base64encode(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  public base64decode(data: string): string {
    return Buffer.from(data, 'base64').toString('utf8');
  }

  public encrypt(data: string): string {
    if (this.publicKey === undefined) {
      throw new Error('PUBLIC_KEY_REQUIRED');
    }

    try {
      const encryptedBuffer: Buffer = crypto.publicEncrypt(
        {
          key: this.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(data),
      );

      return encryptedBuffer.toString('base64');
    } catch (error) {
      Logger.error({
        code: 'ENCRYPTION_ERROR',
        metadata: {
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public encryptMultiple(data: string[]): string[] {
    return data.map((value) => this.encrypt(value));
  }

  public decrypt(data: string): string {
    if (this.privateKey === undefined) {
      throw new Error('PRIVATE_KEY_REQUIRED');
    }

    try {
      const decryptedBuffer: Buffer = crypto.privateDecrypt(
        {
          key: this.privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(data, 'base64'),
      );

      return decryptedBuffer.toString();
    } catch (error) {
      Logger.error({
        code: 'DECRYPTION_ERROR',
        metadata: {
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public decryptMultiple(data: string[]): string[] {
    return data.map((value) => this.decrypt(value));
  }

  public sign(data: string): string {
    if (this.privateKey === undefined) {
      throw new Error('PRIVATE_KEY_REQUIRED');
    }

    const signature: Buffer = crypto.sign('sha256', Buffer.from(data), {
      key: this.privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });

    return signature.toString('base64');
  }

  public verifySignature(data: string, signature: string): boolean {
    if (this.publicKey === undefined) {
      throw new Error('PUBLIC_KEY_REQUIRED');
    }

    return crypto.verify(
      'sha256',
      Buffer.from(data),
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature),
    );
  }
}
