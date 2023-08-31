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
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  @Column()
  dialCode: string;

  @Column({ default: '' })
  pushNotificationToken: string;

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

  @Column({ default: 1 })
  newNotification: number;

  @Column({ default: false })
  notificationSeen: boolean;

  @Column({ default: false })
  hasPin: boolean;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @Column()
  companyId: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Visitor, (visitor) => visitor.host)
  visitors: Visitor[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    const salt = await bcrypt.genSalt();
    if (this.pwd) {
      this.pwd = await bcrypt.hash(this.pwd, salt);
    }
  }

  @OneToMany(() => Activities, (activity) => activity.user)
  activities: Activities[];

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    const salt = await bcrypt.genSalt();
    if (this.pwd) {
      this.pwd = await bcrypt.hash(this.pwd, salt);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.pwd);
  }
}
