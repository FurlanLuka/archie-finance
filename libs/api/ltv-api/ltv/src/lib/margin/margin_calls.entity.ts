import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Liquidation } from './liquidation.entity';

@Entity({
  name: 'margin_margin_calls',
})
export class MarginCall {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Index()
  @Column('varchar')
  userId: string;

  @OneToOne((_) => Liquidation, (liquidation) => liquidation.marginCall, {
    nullable: true,
  })
  liquidation: Liquidation | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
