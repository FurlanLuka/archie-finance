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
  name: 'margin_margin_notifications',
})
export class MarginNotification {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Index({ unique: true })
  @Column('varchar')
  userId: string;

  @Column({ type: 'float', nullable: true })
  sentAtLtv: number | null;

  @Column({ type: 'boolean' })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
