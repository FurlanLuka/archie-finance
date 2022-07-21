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
import { ConfigService } from '@archie/api/utils/config';
import {
  AssetList,
  AssetInformation,
  AssetType,
} from '@archie/api/utils/interfaces/asset_information';
import {
  DepositAddressUnknownAssetError,
  GenerateOmnubusWalletInternalError,
  GeneratePersonalWalletInternalError,
} from './deposit_address.errors';

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
  ): Promise<GetDepositAddressResponse> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    if (Object.keys(assetList).includes(asset) === false) {
      throw new DepositAddressUnknownAssetError({
        asset,
        userId,
      });
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
