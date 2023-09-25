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
import { User } from '../auth/user.entity';

@Entity()
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  href: string;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'enum', enum: NotificationCategories })
  category: NotificationCategories;

  @Column({ type: 'enum', enum: NotificationRel })
  type: NotificationRel;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
