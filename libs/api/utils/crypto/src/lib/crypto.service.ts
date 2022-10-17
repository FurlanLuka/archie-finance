import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { CryptoConfig } from './crypto.interfaces';
import { createHmac } from 'crypto';

@Injectable()
export class CryptoService {
  constructor(@Inject('CRYPTO_OPTIONS') private cryptoConfig: CryptoConfig) {}

  public randomBytes(size: number): Buffer {
    return crypto.randomBytes(size);
  }

  public sha256(data: crypto.BinaryLike): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public computeHmac(
    secret: string,
    data: string | Buffer,
    hashAlgorithm = 'sha256',
  ): string {
    const hmac = createHmac(hashAlgorithm, secret);
    hmac.update(data);

    return hmac.digest('hex');
  }

  public base64encode(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  public base64decode(data: string): string {
    return Buffer.from(data, 'base64').toString('utf8');
  }

  public encrypt(data: string): string {
    if (this.cryptoConfig.encryptionKey === undefined) {
      throw new Error('ENCRYPTION_KEY_REQUIRED');
    }

    try {
      const iv = this.randomBytes(16);
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        this.cryptoConfig.encryptionKey,
        iv,
      );

      const encrypted: Buffer = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      const tag: Buffer = cipher.getAuthTag();

      return Buffer.concat([iv, tag, encrypted]).toString('base64');
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
    if (this.cryptoConfig.encryptionKey === undefined) {
      throw new Error('ENCRYPTION_KEY_REQUIRED');
    }

    try {
      const buffer: Buffer = Buffer.from(data, 'base64');

      const iv: Buffer = buffer.slice(0, 16);
      const tag: Buffer = buffer.slice(16, 32);
      const encryptedText: Buffer = buffer.slice(32);

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        this.cryptoConfig.encryptionKey,
        iv,
      );

      decipher.setAuthTag(tag);

      return (
        decipher.update(encryptedText, undefined, 'utf8') +
        decipher.final('utf8')
      );
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
}
