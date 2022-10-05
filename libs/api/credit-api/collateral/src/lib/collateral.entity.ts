import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';

@Entity({
  name: 'collateral',
})
export class Collateral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  userId: string;

  @Column('varchar', { nullable: false })
  asset: string;

  @Column('numeric', {
    nullable: false,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  amount: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
