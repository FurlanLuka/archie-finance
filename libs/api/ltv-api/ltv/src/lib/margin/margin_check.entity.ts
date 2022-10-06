import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'margin_check',
})
export class MarginCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('float', {
    comment:
      'Approximate asset price in usd. Property is used to calculate collateral value change in usd. Price is updated every time the collateral value updates by 10%',
  })
  ledgerValue: number;

  @Column('float')
  ltv: number;

  @Column('timestamp', { nullable: false, default: new Date().toISOString() })
  ltvCalculatedAt: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
