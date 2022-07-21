import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarginCall } from './margin_calls.entity';

@Entity({
  name: 'liquidation_logs',
})
export class LiquidationLog {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column('varchar')
  userId: string;

  @Column('varchar')
  asset: string;

  @Column('float')
  amount: number;

  @Column('float')
  price: number;

  @ManyToOne(() => MarginCall, (marginCall: MarginCall) => marginCall.uuid)
  marginCall: MarginCall;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
