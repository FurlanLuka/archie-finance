import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CryptoService } from '@archie/api/utils/crypto';
import { Waitlist } from './waitlist.entity';
import {
  GetWaitlistRecordResponse,
  ReferralRankQueryResult,
} from './waitlist.interfaces';
import { ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  JOINED_WAITLIST_TOPIC,
  APPLIED_TO_WAITLIST_TOPIC,
} from '@archie/api/referral-system-api/constants';
import { v4 } from 'uuid';
import { EmailVerificationInternalError } from './waitlist.errors';
import { QueueService } from '@archie/api/utils/queue';

@Injectable({})
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist) private waitlist: Repository<Waitlist>,
    private dataSource: DataSource,
    private cryptoService: CryptoService,
    private queueService: QueueService,
    private configService: ConfigService,
  ) {}

  public async create(emailAddress: string, referrer?: string): Promise<void> {
    const emailIdentifier: string = this.cryptoService.sha256(emailAddress);

    const waitlistEntity: Waitlist | null = await this.waitlist.findOneBy({
      emailIdentifier,
    });

    if (waitlistEntity !== null) {
      return;
    }

    const encryptedEmail: string = this.cryptoService.encrypt(emailAddress);

    const id: string = v4();

    this.queueService.publish(APPLIED_TO_WAITLIST_TOPIC, {
      emailAddress,
      verifyAddress: `${this.configService.get(
        ConfigVariables.ARCHIE_MARKETING_WEBSITE_URL,
      )}/verify?id=${id}`,
    });

    await this.waitlist.insert({
      id,
      emailAddress: encryptedEmail,
      emailIdentifier,
      referrer,
    });
  }

  public async get(id: string): Promise<GetWaitlistRecordResponse> {
    const waitlistEntity: Waitlist | null = await this.waitlist.findOneBy({
      id,
    });

    if (waitlistEntity === null) {
      throw new NotFoundException();
    }

    const referralRankData: ReferralRankQueryResult =
      await this.getReferralRankData(waitlistEntity.id);

    return {
      numberOfReferrals: Number(referralRankData.referralcount),
      numberOfVerifiedReferrals: Number(referralRankData.verifiedreferralcount),
      waitlistRank: Number(referralRankData.rownumber),
      referralCode: waitlistEntity.referralCode,
    };
  }

  private async getReferralRankData(
    waitlistEntityId,
  ): Promise<ReferralRankQueryResult> {
    const queryResult: ReferralRankQueryResult[] = await this.dataSource.query(
      `
      SELECT 
        rowNumber, referralCount, verifiedReferralCount
      FROM (
        SELECT
          w.id AS id,
          ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT w2.id) DESC, w."createdAt" ASC) AS rowNumber,
          COUNT(w1.id) AS referralCount,
          COUNT(w2.id) AS verifiedReferralCount
        FROM
          waitlist w
          LEFT JOIN waitlist w1 ON w1. "referrer" = w. "referralCode"
          LEFT JOIN waitlist w2 ON w2. "referrer" = w. "referralCode" AND w2."isEmailVerified" = true
        WHERE
          w."isEmailVerified" = TRUE
        GROUP BY
          w.id
      ) list WHERE list.id = '${waitlistEntityId}'
    `,
    );

    if (queryResult.length === 0) {
      throw new NotFoundException();
    }

    return queryResult[0];
  }

  public async verifyEmail(id: string): Promise<void> {
    const waitlistEntity: Waitlist | null = await this.waitlist.findOneBy({
      id,
    });

    if (waitlistEntity === null) {
      throw new NotFoundException();
    }

    if (waitlistEntity.isEmailVerified) {
      return;
    }

    try {
      const emailAddress = this.cryptoService.decrypt(
        waitlistEntity.emailAddress,
      );

      this.queueService.publish(JOINED_WAITLIST_TOPIC, {
        emailAddress,
      });

      this.waitlist.update(
        {
          id: waitlistEntity.id,
        },
        { isEmailVerified: true },
      );
    } catch (error) {
      throw new EmailVerificationInternalError({
        error: JSON.stringify(error),
      });
    }
  }
}
