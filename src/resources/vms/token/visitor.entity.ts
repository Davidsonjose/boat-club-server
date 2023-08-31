import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Company } from 'src/resources/company/company.entity';
import { CodeStatus } from 'src/dto/otp';
import { User } from 'src/resources/auth/user.entity';

@Entity()
export class Visitor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  phoneNumber: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  purposeOfVisit: string;

  @Column()
  oneTime: boolean;

  @ManyToOne(() => User, (user) => user.visitors, { eager: false })
  host: User;

  @Column({ default: false })
  completed: boolean;
}
