import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'ltv_collateral',
})
@Index(['userId', 'asset'])
export class LtvCollateral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('varchar', { nullable: false })
  asset: string;

  @Column('float', { nullable: false })
  amount: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
