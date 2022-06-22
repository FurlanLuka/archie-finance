// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Waitlist } from '../waitlist/waitlist.entity';

// @Entity({
//   name: 'referral',
// })
// export class Referral {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column('varchar')
//   referralCode: string;

//   @OneToOne(() => Waitlist, (waitlist) => waitlist.referralEntity)
//   waitlistEntity: Waitlist;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
