import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { A_User } from 'src/services/admin/admin.entity';

@Entity()
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  //   @ApiProperty()
  latitude: string;

  @Column({ nullable: true })
  longtitude: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  countryCode: string;

  @Column({ nullable: true })
  continent: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ default: false })
  isEu: boolean;

  @OneToOne(() => User, (user) => user.location)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @OneToOne(() => A_User, (admin) => admin.location, { nullable: true })
  @JoinColumn()
  admin: A_User;

  @Column({ nullable: true })
  adminId: string;
}
