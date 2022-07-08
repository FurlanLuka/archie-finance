import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletDto } from './wallet.dto';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}
  async createWallet({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }): Promise<WalletDto> {
    const wallet = await this.walletRepository.save({
      userId,
      name,
      walletId: 'twaja mama',
    });

    return wallet;
  }
}
