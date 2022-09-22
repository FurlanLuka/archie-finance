import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreditLimit } from './credit_limit.entity';

@Entity({
  name: 'credit_limit_asset',
})
@Index(['asset', 'creditLimit'], { unique: true })
export class CreditLimitAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  asset: string;

  @Column('float')
  limit: number;

  @ManyToOne(
    (_type) => CreditLimit,
    (creditLimit) => creditLimit.creditLimitAssets,
  )
  creditLimit: CreditLimit;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
