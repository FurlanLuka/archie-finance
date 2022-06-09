import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  public sha256(data: crypto.BinaryLike): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public base64encode(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  public base64decode(data: string): string {
    return Buffer.from(data, 'base64').toString('utf8');
  }
}
