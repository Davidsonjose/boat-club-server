import { OtpChannelType } from 'src/dto/otp';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OtpVerification extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  otp: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'enum', enum: OtpChannelType })
  channel: OtpChannelType;

  @CreateDateColumn()
  createdAt: Date;
}
