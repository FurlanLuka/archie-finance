import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'credit',
})
export class Credit {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('float')
  totalCredit: number;

  @Column('float')
  availableCredit: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
