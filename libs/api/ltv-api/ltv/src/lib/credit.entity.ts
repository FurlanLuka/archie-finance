import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'ltv_credit',
})
@Index(['userId', 'calculatedAt'])
export class LtvCredit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  userId: string;

  @Column('float', { nullable: false })
  utilizationAmount: number;

  @Column('timestamp', { nullable: false })
  calculatedAt: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
