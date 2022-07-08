import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FireblocksService } from '../fireblocks/fireblocks.service';
import { WalletDto } from './wallet.dto';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private fireblocksService: FireblocksService,
  ) {}
  async createWallet({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }): Promise<WalletDto> {
    const externalWalletId = await this.fireblocksService.createExternalWallet({
      userId,
      name,
    });
    const wallet = await this.walletRepository.save({
      userId,
      name,
      walletId: externalWalletId,
    });

    return wallet;
  }
}
