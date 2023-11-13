import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { User } from '../auth/user.entity';

@Entity()
export class BroadcastMessage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  subject: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => Company, (company) => company.broadcastMessages)
  company: Company;

  @Column()
  companyId: number;
}
