import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'last_debit_card_update_meta',
})
export class LastDebitCardUpdateMeta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('timestamp', { nullable: false })
  adjustmentCalculatedAt: string;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  cardStatusChangedAt: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
