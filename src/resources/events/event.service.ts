import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from 'src/dto/events';
import { Events } from './events.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Events)
    private eventRepository: Repository<Events>,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    try {
      const { title, category, amount, visitor, user } = createEventDto;

      const newEvent: Events = this.eventRepository.create({
        user,
        category,
        title,
        amount,
        visitor,
        userId: user.id,
      });

      await this.eventRepository.save(newEvent);

      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  async getUserRecentEvents(
    user: User,
    page: number = 1,
    pageSize: number = 8,
  ): Promise<Events[]> {
    try {
      const skip = (page - 1) * pageSize;
      return await this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.visitor', 'visitor')
        .where('events.userId = :userId', { userId: user.id })
        .skip(skip)
        .take(pageSize)
        .orderBy('events.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw error;
    }
  }
}
