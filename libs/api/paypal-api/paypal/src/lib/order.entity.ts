import { Column, Entity, PrimaryColumn } from 'typeorm';
import { OrderStatus } from './paypal.interfaces';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  userId: string;

  @Column('float')
  paymentAmount: number;

  @Column('varchar')
  orderId: string;

  @Column('varchar')
  orderStatus: OrderStatus;
}
