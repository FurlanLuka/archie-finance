import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarginCalls } from './margin_calls.entity';

@Entity({
  name: 'liquidation_logs',
})
export class LiquidationLogs {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Column('varchar')
  userId: string;

  @Column('varchar')
  asset: string;

  @Column('float')
  amount: number;

  @Column('float')
  price: number;

  @ManyToOne(() => MarginCalls, (marginCall: MarginCalls) => marginCall.uuid)
  marginCall: MarginCalls;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
