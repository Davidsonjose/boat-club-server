import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Company } from 'src/resources/company/company.entity';
import { CodeStatus } from 'src/dto/otp';
import { User } from 'src/resources/auth/user.entity';
import { Guest } from '../guest/guest.entity';

@Entity()
export class Visitor extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @IsNotEmpty()
  code: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({ default: false })
  cancelled: boolean;

  @Column()
  userId: string;

  @Column({ default: CodeStatus.INACTIVE, enum: CodeStatus })
  status: CodeStatus;

  @Column({ default: 0 })
  usage: number;

  @Column({ nullable: true })
  purposeOfVisit: string;

  @Column()
  oneTime: boolean;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  expired: boolean;

  @ManyToOne(() => User, (user) => user.visitors, { eager: false })
  host: User;

  @ManyToOne(() => Guest, { eager: false }) // Establish a relationship with Guest entity
  @JoinColumn()
  guest: Guest;
}
