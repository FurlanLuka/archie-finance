import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlaidService {
  constructor() {
    console.log('konso');
  }

  public async helloPlaid(userId: string): Promise<string> {
    return 'plaid bruh';
  }
}
