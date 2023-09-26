import { ActivityEnumType } from 'src/dto/activity/activity.dto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { A_User } from 'src/services/admin/admin.entity';

@Entity()
export class Activities extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  activityHash: string;

  @Column({ type: 'enum', enum: ActivityEnumType })
  activityType: ActivityEnumType;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  adminId: string;

  @Column({ default: 0 })
  usage: number;

  @Column()
  expectedUsage: number;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => A_User, (admin) => admin.activities, { nullable: true })
  admin: A_User;

  @CreateDateColumn()
  createdAt: Date;
}
