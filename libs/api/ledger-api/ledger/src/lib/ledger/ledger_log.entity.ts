import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';
import { LedgerActionType } from '@archie/api/ledger-api/data-transfer-objects';

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
    type: 'varchar',
    nullable: false,
  })
  action: LedgerAction;

  @Column('varchar', { nullable: false })
  actionType: LedgerActionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
