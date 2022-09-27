import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';

export enum LedgerAction {
  LEDGER_ACCOUNT_CREATED = 'LEDGER_ACCOUNT_CREATED',
  LEDGER_ACCOUNT_INCREMENTED = 'COLLATERAL_DEPOSIT',
  LEDGER_ACCOUNT_DECREMENTED = 'COLLATERAL_WITHDRAWAL',
}

@Entity({
  name: 'ledger_log',
})
export class LedgerLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  userId: string;

  @Column('varchar', { nullable: false })
  assetId: string;

  @Column('numeric', {
    nullable: false,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  amount: string;

  @Column({
    type: 'enum',
    enum: LedgerAction,
    nullable: false,
  })
  action: LedgerAction;

  @Column('varchar')
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
