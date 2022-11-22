import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Liquidation } from './liquidation.entity';
import { In, Repository } from 'typeorm';
import { LiquidationsPerUser } from './liquidation.interfaces';
import { GroupingHelper } from '@archie/api/utils/helpers';

@Injectable()
export class LiquidationService {
  constructor(
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
  ) {}

  public async getLiquidations(
    userIds: string[],
  ): Promise<LiquidationsPerUser> {
    const liquidations: Liquidation[] = await this.liquidationRepository.find({
      where: {
        marginCall: {
          userId: In(userIds),
        },
      },
      relations: {
        marginCall: true,
      },
    });

    return GroupingHelper.groupBy(
      liquidations,
      (liquidation) => liquidation.marginCall.userId,
    );
  }
}
