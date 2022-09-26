import {
  Column,
  Entity,
  Index,
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

  @OneToOne((_) => Borrower, (borrower) => borrower.uuid, { nullable: false })
  borrower: Borrower;
}
