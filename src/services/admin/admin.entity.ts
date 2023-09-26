import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Activities } from 'src/resources/activity/activity.entity';
import { A_Notifications } from './a_notification.entity';
import { Visitor } from 'src/resources/vms/token/visitor.entity';
import { Company } from 'src/resources/company/company.entity';
import { A_Settings } from './a_settings.entity';
import { Location } from 'src/resources/location/location.entity';

export enum AdminRoles {
  SUPPORT = 'SUPPORT',
  SUPERVISOR = 'SUPERVISOR',
  MANAGER = 'MANAGER',
}
@Entity()
export class A_User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  pwd: string;

  @Column({ default: false })
  hasPin: boolean;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  country: string;

  @Column({ default: '', nullable: true })
  pin: string;

  @Column({ type: 'enum', enum: AdminRoles })
  role: AdminRoles;

  @OneToMany(() => Visitor, (visitor) => visitor.host)
  visitors: Visitor[];

  @OneToMany(() => A_Notifications, (notification) => notification.admin)
  notifications: A_Notifications[];

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @Column({ nullable: true })
  profileImageUrl: string;

  @OneToMany(() => Activities, (activity) => activity.admin)
  activities: Activities[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  phoneNumber: string;

  @OneToOne(() => A_Settings, (setting) => setting.admin)
  @JoinColumn()
  settings: A_Settings;

  @OneToOne(() => Location, (location) => location.admin)
  @JoinColumn()
  // @ApiProperty()
  location: Location;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.pwd);
  }
}

// id              String            @id @default(auto()) @map("_id") @db.ObjectId
// role            A_Role            @default(SUPPORT)
// email           String
// hash            String
// firstName       String
// lastName        String
// active          Boolean
// updatedAt       DateTime          @updatedAt
// createdAt       DateTime          @default(now())
// loggedInAt      DateTime?

// enum A_Role {
//     SUPPORT //only view, mark and support
//     SUPERVISOR // regular admin
//     MANAGER //root admin
//   }
