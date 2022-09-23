import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateAddressResponse } from 'fireblocks-sdk';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { Repository } from 'typeorm';
import { OmnibusVaultAccountService } from '@archie/api/collateral-api/omnibus-vault-account';
import { UserVaultAccountService } from '@archie/api/collateral-api/user-vault-account';
import { DepositAddress } from './deposit_address.entity';
import { ConfigService } from '@archie/api/utils/config';
import {
  AssetList,
  AssetInformation,
  AssetType,
} from '@archie/api/collateral-api/asset-information';
import {
  DepositAddressUnknownAssetError,
  GenerateOmnubusWalletInternalError,
  GeneratePersonalWalletInternalError,
} from './deposit_address.errors';
import { GetDepositAddressResponseDto } from '@archie/api/collateralization-api/data-transfer-objects';

@Injectable()
export class DepositAddressService {
  constructor(
    @InjectRepository(DepositAddress)
    private depositAddressRepository: Repository<DepositAddress>,
    private omnibusVaultAccountService: OmnibusVaultAccountService,
    private userVaultAccountService: UserVaultAccountService,
    private configService: ConfigService,
  ) {}


  // TODO should we split this into a get and create function?
  public async getDepositAddress(
    asset: string,
    userId: string,
  ): Promise<GetDepositAddressResponseDto> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    const assetInformation: AssetInformation | undefined = assetList[asset];

    if (assetInformation === undefined) {
      throw new DepositAddressUnknownAssetError({
        asset,
        userId,
      });
    }

    const depositAddress: DepositAddress | null =
      await this.depositAddressRepository.findOneBy({
        asset,
        userId,
      });

    if (depositAddress) {
      return {
        address: depositAddress.address,
        asset,
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
      asset,
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
      throw new GeneratePersonalWalletInternalError({
        asset,
        error: JSON.stringify(error),
      });
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
      throw new GenerateOmnubusWalletInternalError({
        asset,
        error: JSON.stringify(error),
      });
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
