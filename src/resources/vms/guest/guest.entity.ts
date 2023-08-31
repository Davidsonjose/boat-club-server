import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Visitor } from '../token/visitor.entity';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  visitorId: number;
}
