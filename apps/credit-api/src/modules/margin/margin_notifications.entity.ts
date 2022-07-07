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
  name: 'margin_notifications',
})
export class MarginNotifications {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Index({ unique: true })
  @Column('varchar')
  userId: string;

  @Column({ type: 'int', nullable: true })
  sentAtLtv: number | null;

  // soft delete??
  @Column({ type: 'boolean' })
  active: boolean:

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}