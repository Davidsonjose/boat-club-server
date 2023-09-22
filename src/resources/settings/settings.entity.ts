import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Settings extends BaseEntity {
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

  @Column({ nullable: true })
  inviteLimit: number;

  @Column({ default: '$' })
  defaultCurrencySymbol: string;

  @Column({ default: 1 })
  unseenNotification: number;

  @Column({ default: false })
  notificationSeen: boolean;

  @Column({ default: 0 })
  totalGuest: number;

  @Column({ type: 'uuid', nullable: true, default: null })
  userId: string;

  @Column({ nullable: true, default: null })
  adminId: string;

  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn()
  user: User;
}
