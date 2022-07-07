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
  name: 'margin_calls',
})
export class MarginCalls {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  uuid: string;

  @Index({ unique: true })
  @Column('varchar')
  userId: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
