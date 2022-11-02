import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Borrower } from './borrower.entity';

@Entity({
  name: 'last_credit_limit_update',
})
export class LastCreditLimitUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  @Index()
  calculatedAt: string;

  @OneToOne((_) => Borrower, (borrower) => borrower.lastCreditLimitUpdate, {
    nullable: false,
  })
  @JoinColumn()
  borrower: Borrower;
}
