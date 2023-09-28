import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Visitor } from '../vms/token/visitor.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  dialCode: string;

  @Column({ default: '' })
  logoUrl: string;

  @Column({ default: 7 })
  visitExitTime: number;

  @Column({ default: 3 })
  defaultInviteLimit: number;

  @Column({ default: false })
  oneTime: boolean;

  @Column({ default: false })
  sendNewUserMail: boolean;

  @Column({ default: false })
  rejectionMail: boolean;

  @OneToMany(() => User, (user) => user.company, { nullable: true })
  users: User[];

  @OneToMany(() => Visitor, (visitor) => visitor.company, { nullable: true })
  visitors: Visitor[];
}
