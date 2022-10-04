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
export class CreditLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  userId: string;

  @Column('float', {
    comment:
      'Collateral value in usd. It is updated together with the credit limit.',
  })
  calculatedOnLedgerValue: number;

  @Column('float')
  creditLimit: number;

  @Column('numeric')
  calculatedAt: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
