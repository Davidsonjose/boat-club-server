import { UserRole } from 'src/dto/auth/user.dto';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Location } from '../location/location.entity';
import { Settings } from '../settings/settings.entity';
import { Notifications } from '../notification/notification.entity';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
import { Activities } from '../activity/activity.entity';
import { Visitor } from '../vms/token/visitor.entity';
import { Events } from '../events/events.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //

  @Column({ nullable: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  @Column()
  dialCode: string;

  @Column({ default: '' })
  pushNotificationToken: string;

  @Column({ default: true })
  allowPushNotification: boolean;

  @Column({ default: '' })
  referralCode: string;

  @Column({ default: '' })
  pin: string;

  @Column()
  country: string;

  @Column()
  profileImageUrl: string;

  @Column({ default: '' })
  hash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: '' })
  pwd: string;

  @OneToOne(() => Location, (location) => location.user)
  @JoinColumn()
  // @ApiProperty()
  location: Location;

  @OneToOne(() => Settings, (setting) => setting.user)
  @JoinColumn()
  settings: Settings;

  // @OneToOne(() => Notifications, (notifications) => notifications.user)
  // @JoinColumn()
  // notifications: Notifications;

  @Column({ default: 0 })
  balance: string;

  @Column({ default: false })
  disapproved: boolean;

  @Column({ default: false })
  hasPin: boolean;

  @Column({ default: false })
  deactivated: boolean;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @Column()
  companyId: number;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ default: false })
  deleteRequested: boolean;

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Visitor, (visitor) => visitor.host)
  visitors: Visitor[];

  // @BeforeInsert()
  // async hashPasswordBeforeInsert() {
  //   const salt = await bcrypt.genSalt();
  //   if (this.pwd) {
  //     this.pwd = await bcrypt.hash(this.pwd, salt);
  //   }
  // }
  @OneToMany(() => Activities, (activity) => activity.user)
  activities: Activities[];

  @OneToMany(() => Events, (events) => events.user)
  events: Events[];

  // @BeforeUpdate()
  // async hashPasswordBeforeUpdate() {
  //   const salt = await bcrypt.genSalt();
  //   if (this.pwd) {
  //     this.pwd = await bcrypt.hash(this.pwd, salt);
  //   }
  // }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    console.log(this.pwd);
    return await bcrypt.compare(candidatePassword, this.pwd);
  }
}
