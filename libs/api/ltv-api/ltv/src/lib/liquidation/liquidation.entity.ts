import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarginCall } from '../margin/entities/margin_calls.entity';

@Entity({
  name: 'margin_call_liquidation',
})
@Index(['isLedgerValueUpdated', 'isCreditUtilizationUpdated', 'marginCall'])
export class Liquidation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isLedgerValueUpdated: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  isCreditUtilizationUpdated: boolean;

  @Column('float', { nullable: false })
  amount: number;

  @OneToOne((_) => MarginCall, (marginCall) => marginCall.liquidation, {
    nullable: false,
  })
  @JoinColumn()
  marginCall: MarginCall;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
