import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { when } from 'jest-when';
import { user } from '../../../test/test-data/user.data';
import { Connection, Repository } from 'typeorm';
import {
  getMockConnectionProvider,
  getMockQueryRunner,
} from '../../../test/unit-test-utils/mock.connection.utils';
import { getMockRepositoryProvider } from '../../../test/unit-test-utils/mock.repository.utils';
import { Collateral } from './collateral.entity';
import { CollateralService } from './collateral.service';
import { CollateralDeposit } from './collateral_deposit.entity';
import { TransactionStatus } from 'fireblocks-sdk';
import { InternalServerErrorException } from '@nestjs/common';

describe('CollateralService', () => {
  let service: CollateralService;

  let collateralRepository: Repository<Collateral>;
  let collateralDepositRepository: Repository<CollateralDeposit>;

  let connection: Connection;

  const queryRunnerMock = getMockQueryRunner();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollateralService,
        getMockRepositoryProvider(Collateral),
        getMockRepositoryProvider(CollateralDeposit),
        getMockConnectionProvider(),
      ],
    }).compile();

    service = module.get(CollateralService);

    collateralRepository = module.get(getRepositoryToken(Collateral));
    collateralDepositRepository = module.get(
      getRepositoryToken(CollateralDeposit),
    );

    connection = module.get(getConnectionToken());

    when(connection.createQueryRunner)
      .calledWith()
      .mockReturnValue(queryRunnerMock as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#createDeposit', () => {
    const transactionId = 'transactionId';
    const destinationAddress = 'destinationAddress';

    it('should save the deposit and increment the collateral amount', async () => {
      when(collateralDepositRepository.findOne)
        .calledWith({ transactionId })
        .mockResolvedValue(undefined);

      when(collateralRepository.findOne)
        .calledWith({
          userId: user.id,
          asset: 'BTC',
        })
        .mockResolvedValue(undefined);

      await service.createDeposit(
        transactionId,
        user.id,
        'BTC',
        1,
        destinationAddress,
        TransactionStatus.COMPLETED,
      );

      expect(queryRunnerMock.connect).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.save).toHaveBeenNthCalledWith(
        1,
        CollateralDeposit,
        {
          transactionId,
          userId: user.id,
          asset: 'BTC',
          destinationAddress,
          status: TransactionStatus.COMPLETED,
          amount: 1,
        },
      );
      expect(queryRunnerMock.manager.save).toHaveBeenNthCalledWith(
        2,
        Collateral,
        {
          userId: user.id,
          asset: 'BTC',
          amount: 1,
        },
      );
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalledTimes(1);
    });

    it('should save the deposit but not increment collateral amount because the transaction is not completed', async () => {
      when(collateralDepositRepository.findOne)
        .calledWith({ transactionId })
        .mockResolvedValue(undefined);

      await service.createDeposit(
        transactionId,
        user.id,
        'BTC',
        1,
        destinationAddress,
        TransactionStatus.QUEUED,
      );

      expect(queryRunnerMock.connect).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.save).toHaveBeenCalledWith(
        CollateralDeposit,
        {
          transactionId,
          userId: user.id,
          asset: 'BTC',
          destinationAddress,
          status: TransactionStatus.QUEUED,
          amount: 1,
        },
      );
      expect(queryRunnerMock.manager.save).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalledTimes(1);
    });

    it('should throw internal server error exception and rollback the transaction because something failed', async () => {
      when(collateralDepositRepository.findOne)
        .calledWith({ transactionId })
        .mockResolvedValue(undefined);

      when(queryRunnerMock.manager.save)
        .calledWith(CollateralDeposit, {
          transactionId,
          userId: user.id,
          asset: 'BTC',
          destinationAddress,
          status: TransactionStatus.QUEUED,
          amount: 1,
        })
        .mockRejectedValue(new Error('error'));

      await expect(
        service.createDeposit(
          transactionId,
          user.id,
          'BTC',
          1,
          destinationAddress,
          TransactionStatus.QUEUED,
        ),
      ).rejects.toThrowError(InternalServerErrorException);

      expect(queryRunnerMock.connect).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalledTimes(1);
    });
  });
});
