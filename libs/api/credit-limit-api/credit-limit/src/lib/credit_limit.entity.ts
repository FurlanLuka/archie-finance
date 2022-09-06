import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('float')
  previousCreditLimit: number;

  @Column('timestamp')
  calculatedAt: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
