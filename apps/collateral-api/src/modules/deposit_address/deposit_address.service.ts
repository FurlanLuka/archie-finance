import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateAddressResponse } from 'fireblocks-sdk';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { Repository } from 'typeorm';
import { OmnibusVaultAccountService } from '../omnibus_vault_account/omnibus_vault_account.service';
import { UserVaultAccountService } from '../user_vault_account/user_vault_account.service';
import { DepositAddress } from './deposit_address.entity';
import { GetDepositAddressResponse } from './deposit_address.interfaces';
import { ConfigService } from '@archie-microservices/config';
import {
  AssetList,
  AssetInformation,
  AssetType,
} from '@archie-microservices/api-interfaces/asset_information';

@Injectable()
export class DepositAddressService {
  constructor(
    @InjectRepository(DepositAddress)
    private depositAddressRepository: Repository<DepositAddress>,
    private omnibusVaultAccountService: OmnibusVaultAccountService,
    private userVaultAccountService: UserVaultAccountService,
    private configService: ConfigService,
  ) {}

  public async getDepositAddress(
    asset: string,
    userId: string,
  ): Promise<GetDepositAddressResponse> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    if (Object.keys(assetList).includes(asset) === false) {
      Logger.error({
        code: 'DEPOSIT_ADDRESS_UNKNOWN_ASSET_ERROR',
        metadata: {
          asset,
          userId,
        },
      });

      throw new NotFoundException();
    }

    const assetInformation: AssetInformation | undefined = assetList[asset];

    const depositAddress: DepositAddress | null =
      await this.depositAddressRepository.findOneBy({
        asset,
        userId,
      });

    if (depositAddress) {
      return {
        address: depositAddress.address,
      };
    }

    const generateDepositAddressResponse: GenerateAddressResponse =
      assetInformation.network === AssetType.ERC20 ||
      assetInformation.network === AssetType.SOL
        ? await this.generatePersonalWalletAddress(
            userId,
            assetInformation.fireblocks_id,
          )
        : await this.generateOmnibusWalletAddress(
            userId,
            assetInformation.fireblocks_id,
          );

    await this.depositAddressRepository.save({
      userId,
      asset,
      address: generateDepositAddressResponse.address,
    });

    return {
      address: generateDepositAddressResponse.address,
    };
  }

  private async generatePersonalWalletAddress(
    userId: string,
    asset: string,
  ): Promise<GenerateAddressResponse> {
    try {
      const address: string =
        await this.userVaultAccountService.createVaultWallet(asset, userId);

      return {
        address,
      };
    } catch (error) {
      Logger.error({
        code: 'GENERATE_PERSONAL_WALLET_ERROR',
        metadata: {
          userId,
          asset,
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  private async generateOmnibusWalletAddress(
    userId: string,
    asset: string,
  ): Promise<GenerateAddressResponse> {
    try {
      return await this.omnibusVaultAccountService.generateDepositAddress(
        asset,
        userId,
      );
    } catch (error) {
      Logger.error({
        code: 'GENERATE_OMNIBUS_WALLET_ERROR',
        metadata: {
          userId,
          asset,
          error: JSON.stringify(error),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async getUserIdForDepositAddress(address: string): Promise<string> {
    const depositAddress: DepositAddress | null =
      await this.depositAddressRepository.findOneBy({
        address: address,
      });

    if (depositAddress === null) {
      throw new NotFoundException();
    }

    return depositAddress.userId;
  }
}
