import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { A_User } from './admin.entity';

@Entity()
export class A_Settings extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: true })
  enablePushNotification: boolean;

  @Column({ default: true })
  enableEmailNotification: boolean;

  @Column({ default: 'EN' })
  languageCode: string;

  @Column({ default: 'USD' })
  defaultCurrencyCode: string;

  @Column({ default: 'United State Dollar' })
  defaultCurrencyName: string;

  @Column({ default: 0 })
  todayInvite: number;

  @Column({ nullable: true, default: 1 })
  inviteLimit: number;

  @Column({ default: '$' })
  defaultCurrencySymbol: string;

  @Column({ default: 1 })
  unseenNotification: number;

  @Column({ default: false })
  notificationSeen: boolean;

  @Column({ type: 'uuid', nullable: true, default: null })
  adminId: string;

  @Column({ default: 0 })
  totalGuest: number;

  @Column({ nullable: true })
  companyId: number;

  @OneToOne(() => A_User, (admin) => admin.settings, { nullable: true })
  @JoinColumn()
  admin: A_User;
}
