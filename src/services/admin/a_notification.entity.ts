import {
  NotificationCategories,
  NotificationRel,
} from 'src/dto/notification/notification-enum.dto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { A_User } from './admin.entity';
import { User } from 'src/resources/auth/user.entity';

@Entity()
export class A_Notifications extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  href: string;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: NotificationCategories })
  category: NotificationCategories;

  @Column({ type: 'enum', enum: NotificationRel })
  type: NotificationRel;

  @ManyToOne(() => A_User, (admin) => admin.notifications, { nullable: true })
  admin: A_User;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: true })
  user: User;

  @Column({ nullable: true })
  adminId: string;

  @CreateDateColumn()
  createdAt: Date;
}
