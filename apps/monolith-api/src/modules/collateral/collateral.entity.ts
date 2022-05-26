import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('float', { nullable: false })
  amount: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
