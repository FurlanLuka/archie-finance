import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'liquidation_logs',
})
export class LiquidationLogs {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Index()
  @Column('varchar')
  userId: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}