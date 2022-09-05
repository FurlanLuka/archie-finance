import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'payment_identifier',
})
export class PaymentIdentifier {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('double')
  paymentAmount: number;

}