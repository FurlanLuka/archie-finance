import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'margin_collateral_check',
})
export class MarginCollateralCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  userId: string;

  @Column('float', {
    comment:
      'Approximate asset price in usd. Property is used to calculate collateral value change in usd. Price is updated every time the collateral value updates by 10%',
  })
  checked_at_collateral_balance: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
