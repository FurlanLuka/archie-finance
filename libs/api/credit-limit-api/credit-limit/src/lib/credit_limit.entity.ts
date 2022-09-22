import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreditLimitAsset } from './credit_limit_asset.entity';

@Entity({
  name: 'credit_limit',
})
export class CreditLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('float', {
    comment:
      'Collateral value in usd. It is updated together with the credit limit.',
  })
  calculatedOnCollateralBalance: number;

  @Column('float')
  creditLimit: number;

  @Column('timestamp')
  calculatedAt: string;

  @OneToMany(
    (_type) => CreditLimitAsset,
    (creditLimitAsset) => creditLimitAsset.creditLimit,
  )
  creditLimitAssets: CreditLimitAsset[];

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
