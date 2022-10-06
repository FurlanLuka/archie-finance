import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'ledger_account',
})
@Index(['userId', 'assetId'], { unique: true })
export class LedgerAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('varchar', { nullable: false })
  assetId: string;

  @Column('float', {
    comment: 'Ledger account value in USD',
  })
  value: number;

  @Column('numeric')
  calculatedAt: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
