import { IsNumber, MinLength } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeStatus } from './dto/code-status.dto';

@Entity()
export class Code extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @MinLength(6, {
    message: 'Code length should not been less than 6 characters',
  })
  @Column()
  code: number;

  @Column({ default: CodeStatus.NOT_USED })
  status: CodeStatus;
}
