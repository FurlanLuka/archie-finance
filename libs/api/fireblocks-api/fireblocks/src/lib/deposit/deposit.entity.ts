import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';

@Entity({
  name: 'deposit',
})
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  userId: string;

  @Column('varchar')
  assetId: string;

  @Column('varchar')
  transactionId: string;

  @Column('numeric', {
    nullable: false,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  amount: string;

  @Column('numeric', {
    nullable: false,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  fee: string;

  @Column('varchar')
  sourceAddress: string;

  @Column('varchar')
  destinationAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
