import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LastCreditLimitUpdate } from './last_credit_limit_update.entity';

@Entity({
  name: 'borrower',
})
export class Borrower {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index({ unique: true })
  @Column('varchar')
  userId: string;

  @Column('varchar')
  personId: string;

  @Column('varchar', { nullable: true })
  encryptedEmail: string | null;

  @Column('varchar', { nullable: true })
  homeAddressContactId: string | null;

  @Column('varchar', { nullable: true })
  creditLineId: string | null;

  @Column('varchar', { nullable: true })
  liquidationInstrumentId: string | null;

  @Column('varchar', { nullable: true })
  paypalInstrumentId: string | null;

  @Column('varchar', { nullable: true })
  drawId: string | null;

  @OneToOne(
    (_) => LastCreditLimitUpdate,
    (creditLimitUpdate) => creditLimitUpdate.id,
  )
  lastCreditLimitUpdate: LastCreditLimitUpdate | null;
}
