import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'margin_margin_calls',
})
@Index(['userId', 'deletedAt'], { unique: true })
export class MarginCall {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Index()
  @Column('varchar')
  userId: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
