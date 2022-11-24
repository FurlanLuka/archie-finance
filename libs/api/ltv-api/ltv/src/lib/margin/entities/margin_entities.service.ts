import { Injectable } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarginCall } from './margin_calls.entity';
import { MarginCheck } from './margin_check.entity';
import { MarginNotification } from './margin_notifications.entity';
import { MarginCallStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { GroupingHelper, GroupMap } from '@archie/api/utils/helpers';

@Injectable()
export class MarginEntitiesService {
  constructor(
    @InjectRepository(MarginCall)
    private marginCallsRepository: Repository<MarginCall>,
    @InjectRepository(MarginCheck)
    private marginCheckRepository: Repository<MarginCheck>,
    @InjectRepository(MarginNotification)
    private marginNotificationRepository: Repository<MarginNotification>,
  ) {}

  public async getMarginCallsWithLiquidationsPerUser(
    userIds: string[],
  ): Promise<GroupMap<MarginCall>> {
    const marginCalls: MarginCall[] = await this.marginCallsRepository.find({
      where: {
        userId: In(userIds),
      },
      relations: {
        liquidation: true,
      },
    });

    return GroupingHelper.mapBy(marginCalls, (marginCall) => marginCall.userId);
  }

  public async getMarginChecksPerUser(
    userIds: string[],
  ): Promise<GroupMap<MarginCheck>> {
    const marginChecks: MarginCheck[] = await this.marginCheckRepository.findBy(
      {
        userId: In(userIds),
      },
    );

    return GroupingHelper.mapBy(
      marginChecks,
      (marginCheck) => marginCheck.userId,
    );
  }

  public async getMarginNotificationsPerUser(
    userIds: string[],
  ): Promise<GroupMap<MarginNotification>> {
    const marginNotifications: MarginNotification[] =
      await this.marginNotificationRepository.findBy({
        userId: In(userIds),
      });

    return GroupingHelper.mapBy(
      marginNotifications,
      (marginNotification) => marginNotification.userId,
    );
  }

  public async getMarginCallsWithDeleted(
    userId: string,
    status: MarginCallStatus | null,
  ): Promise<MarginCall[]> {
    const statusFilter = {
      [MarginCallStatus.active]: IsNull(),
      [MarginCallStatus.completed]: Not(IsNull()),
    };

    return this.marginCallsRepository.find({
      where: {
        userId,
        deletedAt: status === null ? undefined : statusFilter[status],
      },
      withDeleted: true,
    });
  }

  async upsertMarginCheck(
    userId: string,
    ltv: number,
    ledgerValue: number,
  ): Promise<void> {
    await this.marginCheckRepository.upsert(
      {
        userId,
        ltv,
        ledgerValue: ledgerValue,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  async rememberMarginNotificationSent(
    userId: string,
    ltv: number,
  ): Promise<void> {
    await this.marginNotificationRepository.upsert(
      {
        userId: userId,
        active: true,
        sentAtLtv: ltv,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  async resetMarginNotifications(userId: string): Promise<void> {
    await this.marginNotificationRepository.upsert(
      {
        userId: userId,
        active: false,
        sentAtLtv: null,
      },
      {
        conflictPaths: ['userId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );
  }

  async createMarginCall(userId: string): Promise<MarginCall> {
    return this.marginCallsRepository.save({
      userId: userId,
    });
  }

  async softDeleteMarginCall(userId: string): Promise<MarginCall | null> {
    return this.marginCallsRepository
      .createQueryBuilder()
      .softDelete()
      .where({
        userId,
      })
      .returning('*')
      .execute()
      .then((deletedResult): MarginCall | null => deletedResult.raw[0] ?? null);
  }
}
