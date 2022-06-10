import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { user } from '../../../test/test-data/user.data';
import { getMockRepositoryProvider } from '../../../test/unit-test-utils/mock.repository.utils';
import { Repository } from 'typeorm';
import { OmnibusVaultAccountService } from '../omnibus_vault_account/omnibus_vault_account.service';
import { OmnibusVaultAccountServiceMock } from '../omnibus_vault_account/__mocks__/omnibus_vault_account.service.mock';
import { UserVaultAccountService } from '../user_vault_account/user_vault_account.service';
import { UserVaultAccountServiceMock } from '../user_vault_account/__mocks__/user_vault_account.service.mocks';
import { DepositAddress } from './deposit_address.entity';
import { DepositAddressService } from './deposit_address.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { when } from 'jest-when';
import { getDepositAddressData } from './__data__/deposit_address.service.data';
import { getMockConfigServiceProvider } from '../../../test/unit-test-utils/mock.config.service.utils';

describe('DepositAddressService', () => {
  let service: DepositAddressService;

  let omnibusVaultAccountService: OmnibusVaultAccountService;
  let userVaultAccountService: UserVaultAccountService;

  let depositAddressRepository: Repository<DepositAddress>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositAddressService,
        getMockRepositoryProvider(DepositAddress),
        getMockConfigServiceProvider(),
        {
          provide: OmnibusVaultAccountService,
          useClass: OmnibusVaultAccountServiceMock,
        },
        {
          provide: UserVaultAccountService,
          useClass: UserVaultAccountServiceMock,
        },
      ],
    }).compile();

    service = module.get(DepositAddressService);

    omnibusVaultAccountService = module.get(OmnibusVaultAccountService);
    userVaultAccountService = module.get(UserVaultAccountService);

    depositAddressRepository = module.get(getRepositoryToken(DepositAddress));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#getDepositAddress', () => {
    it('should throw not found exception because asset is not supported', async () => {
      await expect(
        service.getDepositAddress('randomAsset', user.id),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return the deposit address without creating a new one', async () => {
      const depositAddressData: DepositAddress = getDepositAddressData('BTC');

      when(depositAddressRepository.findOneBy)
        .calledWith({
          asset: 'BTC',
          userId: user.id,
        })
        .mockResolvedValue(depositAddressData);

      await expect(
        service.getDepositAddress('BTC', user.id),
      ).resolves.toStrictEqual({
        address: depositAddressData.address,
      });
    });

    it('should create and returna new personal deposit wallet address', async () => {
      const depositAddress = 'depositAddress';

      when(depositAddressRepository.findOneBy)
        .calledWith({
          asset: 'ETH',
          userId: user.id,
        })
        .mockResolvedValue(null);

      when(userVaultAccountService.createVaultWallet)
        .calledWith('ETH_TEST', user.id)
        .mockResolvedValue(depositAddress);

      await expect(
        service.getDepositAddress('ETH', user.id),
      ).resolves.toStrictEqual({
        address: depositAddress,
      });
    });

    it('should throw internal server error exception because personal deposit wallet creation failed', async () => {
      const walletCreationError: Error = new Error();

      when(depositAddressRepository.findOneBy)
        .calledWith({
          asset: 'ETH',
          userId: user.id,
        })
        .mockResolvedValue(null);

      when(userVaultAccountService.createVaultWallet)
        .calledWith('ETH_TEST', user.id)
        .mockRejectedValue(walletCreationError);

      await expect(
        service.getDepositAddress('ETH', user.id),
      ).rejects.toThrowError(InternalServerErrorException);
    });

    it('should create and returna new omnibus deposit wallet address', async () => {
      const depositAddress = 'depositAddress';

      when(depositAddressRepository.findOneBy)
        .calledWith({
          asset: 'BTC',
          userId: user.id,
        })
        .mockResolvedValue(null);

      when(omnibusVaultAccountService.generateDepositAddress)
        .calledWith('BTC_TEST', user.id)
        .mockResolvedValue({
          address: depositAddress,
        });

      await expect(
        service.getDepositAddress('BTC', user.id),
      ).resolves.toStrictEqual({
        address: depositAddress,
      });
    });

    it('should throw internal server error exception because omnibus deposit wallet creation failed', async () => {
      const walletCreationError: Error = new Error();

      when(depositAddressRepository.findOneBy)
        .calledWith({
          asset: 'BTC',
          userId: user.id,
        })
        .mockResolvedValue(null);

      when(omnibusVaultAccountService.generateDepositAddress)
        .calledWith('BTC_TEST', user.id)
        .mockRejectedValue(walletCreationError);

      await expect(
        service.getDepositAddress('BTC', user.id),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
