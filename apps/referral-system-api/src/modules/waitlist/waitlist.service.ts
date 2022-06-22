import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CryptoService } from '@archie-microservices/crypto';
import { Waitlist } from './waitlist.entity';
import { VaultService } from '@archie-microservices/vault';
import { SendgridService } from '@archie-microservices/sendgrid';
import {
  GetWaitlistRecordResponse,
  ReferralRankQueryResult,
} from './waitlist.interfaces';

@Injectable({})
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist) private waitlist: Repository<Waitlist>,
    private dataSource: DataSource,
    private cryptoService: CryptoService,
    private vaultService: VaultService,
    private sendgridService: SendgridService,
  ) {}

  public async create(emailAddress: string, referrer?: string): Promise<void> {
    const emailIdentifier: string = this.cryptoService.sha256(emailAddress);

    const waitlistEntity: Waitlist | null = await this.waitlist.findOneBy({
      emailIdentifier,
    });

    if (waitlistEntity !== null) {
      return;
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    const encryptedEmail: string = (
      await this.vaultService.encryptStrings([emailAddress])
    )[0];

    try {
      await this.waitlist.insert({
        emailAddress: encryptedEmail,
        emailIdentifier,
        referrer,
      });



      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release();
    }
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
    };
  }

  private async getReferralRankData(
    waitlistEntityId,
    queryRunner?: QueryRunner,
  ): Promise<ReferralRankQueryResult> {
    const queryResult: ReferralRankQueryResult[] = await this.dataSource.query(
      `
      SELECT 
        rowNumber, referralCount, verifiedReferralCount
      FROM (
        SELECT
          w.id AS id,
          ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT w1.id) DESC, w."createdAt" ASC) AS rowNumber,
          COUNT(w1.id) AS referralCount,
          COUNT(w2.id) AS verifiedReferralCount
        FROM
          waitlist w
          LEFT JOIN waitlist w1 ON w1. "referrer" = w. "referralCode"
          LEFT JOIN waitlist w2 ON w2. "referrer" = w. "referralCode" AND w2."isEmailVerified" = true
        GROUP BY
          w.id
      ) list WHERE list.id = '${waitlistEntityId}'
    `,
      undefined,
      queryRunner,
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

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      await queryRunner.manager.update(
        Waitlist,
        {
          id: waitlistEntity.id,
        },
        { isEmailVerified: true },
      );

      const [emailAddress] = await this.vaultService.decryptStrings([
        waitlistEntity.emailAddress,
      ]);

      await this.sendgridService.addToWaitlist(emailAddress, waitlistEntity.id);

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();

      Logger.error({
        code: 'ERROR_VERIFYING_WAITLIST_EMAIL',
      });

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
    
  }
}
