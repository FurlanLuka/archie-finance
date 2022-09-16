import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'credit_limit_collateral',
})
@Index(['userId', 'asset'], { unique: true })
export class Collateral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('varchar', { nullable: false })
  asset: string;

  @Column('numeric', { nullable: false, precision: 27, scale: 17 })
  amount: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
