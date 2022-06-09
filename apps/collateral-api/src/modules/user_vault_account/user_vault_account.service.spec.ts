import { Test, TestingModule } from '@nestjs/testing';
import { getMockRepositoryProvider } from '../../../test/unit-test-utils/mock.repository.utils';
import { Repository } from 'typeorm';
import { UserVaultAccount } from './user_vault_account.entity';
import { UserVaultAccountService } from './user_vault_account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FireblocksService } from '../fireblocks/fireblocks.service';
import { FireblocksServiceMock } from '../fireblocks/__mocks__/fireblocks.service.mock';
import { when } from 'jest-when';
import { user } from '../../../test/test-data/user.data';
import {
  getDepositAddressResponseData,
  getVaultAccountResponseData,
  getVaultAssetResponseData,
} from '../fireblocks/__data__/fireblocks.service.data';
import {
  DepositAddressResponse,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import { getUserVaultAccountEntityData } from './__data__/user_vault_account.service.data';

describe('UserVaultAccountService', () => {
  let service: UserVaultAccountService;
  let fireblocksService: FireblocksService;

  let userVaultAccountRepository: Repository<UserVaultAccount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserVaultAccountService,
        getMockRepositoryProvider(UserVaultAccount),
        {
          provide: FireblocksService,
          useClass: FireblocksServiceMock,
        },
      ],
    }).compile();

    service = module.get(UserVaultAccountService);
    fireblocksService = module.get(FireblocksService);

    userVaultAccountRepository = module.get(
      getRepositoryToken(UserVaultAccount),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#getUserVaultAccount', () => {
    it('should create new user vault account and return it', async () => {
      const createVaultAccountResponse: VaultAccountResponse =
        getVaultAccountResponseData();

      when(userVaultAccountRepository.findOneBy)
        .calledWith({
          userId: user.id,
        })
        .mockResolvedValue(undefined);

      when(fireblocksService.createVaultAccount)
        .calledWith(user.id)
        .mockResolvedValue(createVaultAccountResponse);

      await expect(service.getUserVaultAccount(user.id)).resolves.toStrictEqual(
        createVaultAccountResponse,
      );

      expect(userVaultAccountRepository.save).toHaveBeenCalledWith({
        userId: user.id,
        vaultAccountId: createVaultAccountResponse.id,
      });
    });
  });

  it('should return existing user vault account', async () => {
    const userVaultAccountEntity: UserVaultAccount =
      getUserVaultAccountEntityData();

    const getVaultAccountResponse: VaultAccountResponse =
      getVaultAccountResponseData();

    when(userVaultAccountRepository.findOneBy)
      .calledWith({
        userId: user.id,
      })
      .mockResolvedValue(userVaultAccountEntity);

    when(fireblocksService.getVaultAccount)
      .calledWith(userVaultAccountEntity.vaultAccountId)
      .mockResolvedValue(getVaultAccountResponse);

    await expect(service.getUserVaultAccount(user.id)).resolves.toStrictEqual(
      getVaultAccountResponse,
    );
  });

  describe('#createVaultWallet', () => {
    const getVaultAccountResponse: VaultAccountResponse =
      getVaultAccountResponseData();

    beforeEach(() => {
      const getUserVaultAccountSpy: jest.SpyInstance = jest.spyOn(
        service,
        'getUserVaultAccount',
      );

      getUserVaultAccountSpy.mockResolvedValue(getVaultAccountResponse);
    });

    it('should create new wallet inside users vault and return the address', async () => {
      const getVaultAssetResponse: VaultAssetResponse =
        getVaultAssetResponseData();

      when(fireblocksService.getDepositAddresses)
        .calledWith(getVaultAccountResponse.id, 'BTC')
        .mockResolvedValue([]);

      when(fireblocksService.createVaultAsset)
        .calledWith(getVaultAccountResponse.id, 'BTC')
        .mockResolvedValue(getVaultAssetResponse);

      await expect(
        service.createVaultWallet('BTC', user.id),
      ).resolves.toStrictEqual(getVaultAssetResponse.address);
    });

    it('should get already existing wallet and return the address', async () => {
      const getDepositAddressResponse: DepositAddressResponse =
        getDepositAddressResponseData('BTC');

      when(fireblocksService.getDepositAddresses)
        .calledWith(getVaultAccountResponse.id, 'BTC')
        .mockResolvedValue([getDepositAddressResponse]);

      await expect(
        service.createVaultWallet('BTC', user.id),
      ).resolves.toStrictEqual(getDepositAddressResponse.address);
    });
  });
});
