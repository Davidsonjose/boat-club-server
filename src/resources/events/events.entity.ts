import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { EventsCategoryEnum } from 'src/interface/events';
import { Visitor } from '../vms/token/visitor.entity';
import Model from 'src/shared/entities/model.entity';

@Entity()
export class Events extends Model {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: EventsCategoryEnum })
  category: EventsCategoryEnum;

  @Column({ nullable: true })
  amount: string;

  @ManyToOne(() => Visitor, { nullable: true })
  @JoinColumn({ name: 'visitorId' })
  visitor: Visitor | null;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @Column()
  userId: string;

  @Column()
  description: string;
}
