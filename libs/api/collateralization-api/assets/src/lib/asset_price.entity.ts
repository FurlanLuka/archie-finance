import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'asset_price',
})
export class AssetPrice {
  @PrimaryColumn('varchar')
  asset: string;

  @Column('float')
  price: number;

  @Column('float', { nullable: false })
  dailyChange: number;

  @Column('varchar')
  currency: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
